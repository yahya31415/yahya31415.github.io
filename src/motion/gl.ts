// Two full-screen fragment shaders: a raymarched chrome blob (hero) and a
// drifting contour terrain (footer). Plain WebGL1, no dependencies.

const HEAD = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 r; uniform float t; uniform vec2 m; uniform vec2 nm;
uniform vec3 acc; uniform float sc; uniform vec2 ctr;
float h(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
`

const BLOB = `
mat2 rot(float a){float c=cos(a);float s=sin(a);return mat2(c,-s,s,c);}
float map(vec3 p){
  p.xz=rot(t*.22+nm.x*1.4)*p.xz;
  p.xy=rot(nm.y*.9+sin(t*.17)*.3)*p.xy;
  float d=length(p)-1.05;
  d+=.24*sin(p.x*2.4+t*.8)*sin(p.y*2.7+t*1.05)*sin(p.z*2.2+t*.65);
  d+=.06*sin(p.x*6.3-t*1.2)*sin(p.y*5.6+t*.9)*sin(p.z*6.1+t*.4);
  return d*.55;
}
vec3 nrm(vec3 p){
  vec2 e=vec2(.003,0.);
  return normalize(vec3(map(p+e.xyy)-map(p-e.xyy),map(p+e.yxy)-map(p-e.yxy),map(p+e.yyx)-map(p-e.yyx)));
}
vec3 env(vec3 d){
  float st=smoothstep(.7,.95,sin(d.x*4.+d.y*7.+t*.3)*.5+.5);
  vec3 c=vec3(.015,.02,.025);
  c+=acc*pow(max(d.y,0.),2.)*.9;
  c+=vec3(1.)*st*.6*smoothstep(-.3,.5,d.y);
  c+=vec3(1.,.54,.3)*pow(max(-d.y*.6-d.x*.5,0.),3.)*1.1;
  return c;
}
void main(){
  // Narrow screens zoom out so the blob stays an object, not a backdrop.
  float zoom=r.x<r.y?1.7:1.;
  vec2 uv=(gl_FragCoord.xy-.5*r)/r.y*zoom-ctr;
  vec3 ro=vec3(0.,0.,4.7-sc*1.7);
  vec3 rd=normalize(vec3(uv,-1.7));
  float d=0.; float md=9.; float hit=0.; vec3 p=ro;
  for(int i=0;i<64;i++){
    p=ro+rd*d; float s=map(p); md=min(md,s);
    if(s<.002){hit=1.;break;}
    d+=s; if(d>8.){break;}
  }
  vec3 bg=vec3(.043,.051,.063);
  vec2 g=fract(gl_FragCoord.xy/30.)-.5;
  vec3 col=bg+vec3(.07)*(1.-smoothstep(.03,.07,length(g)));
  col+=acc*.2*exp(-md*5.);
  if(hit>.5){
    vec3 n=nrm(p);
    float fr=pow(1.-max(dot(-rd,n),0.),3.);
    vec3 rf=reflect(rd,n);
    col=env(rf)*(.6+.6*fr);
    col+=(.5+.5*cos(6.2831*(fr*1.4+n.y*.3+vec3(0.,.33,.67))))*fr*.35;
    col+=acc*fr*.5;
  }
  col+=(h(gl_FragCoord.xy+fract(t)*91.)-.5)*.03;
  gl_FragColor=vec4(col,1.);
}
`

const TERRAIN = `
float n(vec2 p){
  vec2 i=floor(p); vec2 f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y);
}
float fbm(vec2 p){float a=.5;float s=0.;for(int i=0;i<5;i++){s+=a*n(p);p=p*2.03+vec2(17.1,9.7);a*=.5;}return s;}
void main(){
  vec2 uv=(gl_FragCoord.xy-.5*r)/r.y;
  vec2 mu=(m-.5*r)/r.y;
  vec2 dv=uv-mu; float d=length(dv);
  float pull=exp(-d*d*5.);
  vec2 p=uv*1.7+vec2(7.,3.);
  p+=dv*pull*.9;
  float tt=t*.04;
  vec2 q=vec2(fbm(p+vec2(0.,tt)),fbm(p+vec2(5.2,1.3)-tt));
  float f=fbm(p+2.2*q+vec2(tt*.6,-tt*.4));
  f+=pull*.12;
  float bands=f*14.;
  float line=abs(fract(bands)-.5);
  float major=abs(fract(bands*.25)-.5)*4.;
  float l=1.-smoothstep(0.,.07,line);
  float lm=1.-smoothstep(0.,.14,major);
  vec3 bg=vec3(.043,.051,.063);
  float hi=smoothstep(.25,.75,f);
  vec3 col=bg+acc*.06*hi;
  col+=acc*(l*.22+lm*.55)*(.3+.7*hi);
  col+=acc*pull*.12;
  col+=(h(gl_FragCoord.xy+fract(t)*91.)-.5)*.025;
  gl_FragColor=vec4(col,1.);
}
`

const VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}'

export type LayerKind = 'blob' | 'terrain'
export type RGB = [number, number, number]

export type Layer = {
  canvas: HTMLCanvasElement
  gl: WebGLRenderingContext
  kind: LayerKind
  visible: boolean
  mx: number
  my: number
  seen: boolean
  key: string
  u: Record<'r' | 't' | 'm' | 'nm' | 'acc' | 'sc' | 'ctr', WebGLUniformLocation | null>
}

export function hexToRgb(hex: string, fallback: RGB): RGB {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) return fallback
  const n = parseInt(m[1], 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

export function makeLayer(canvas: HTMLCanvasElement, kind: LayerKind): Layer | null {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false })
  if (!gl) return null
  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)
    if (!s) return null
    gl.shaderSource(s, src)
    gl.compileShader(s)
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn('[shader]', kind, gl.getShaderInfoLog(s))
      return null
    }
    return s
  }
  const vs = compile(gl.VERTEX_SHADER, VERT)
  const fs = compile(gl.FRAGMENT_SHADER, HEAD + (kind === 'blob' ? BLOB : TERRAIN))
  const prog = gl.createProgram()
  if (!vs || !fs || !prog) return null
  gl.attachShader(prog, vs)
  gl.attachShader(prog, fs)
  gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null
  gl.useProgram(prog)
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const loc = gl.getAttribLocation(prog, 'p')
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
  const U = (name: string) => gl.getUniformLocation(prog, name)
  return {
    canvas, gl, kind, visible: true, mx: 0, my: 0, seen: false, key: '',
    u: { r: U('r'), t: U('t'), m: U('m'), nm: U('nm'), acc: U('acc'), sc: U('sc'), ctr: U('ctr') },
  }
}

export type DrawInput = {
  time: number
  color: RGB
  scroll: number
  pointerX: number
  pointerY: number
  hasPointer: boolean
  still: boolean
}

export function drawLayer(L: Layer, o: DrawInput) {
  if (!L.visible) return
  const { canvas: c, gl } = L
  const dpr = Math.min(window.devicePixelRatio || 1, L.kind === 'blob' ? 1.25 : 1.5)
  const w = Math.max(2, Math.round(c.clientWidth * dpr))
  const h = Math.max(2, Math.round(c.clientHeight * dpr))
  if (c.width !== w || c.height !== h) {
    c.width = w
    c.height = h
  }
  if (!L.seen) {
    L.mx = w * 0.6
    L.my = h * 0.55
    L.seen = true
  }
  if (o.hasPointer && !o.still) {
    const rc = c.getBoundingClientRect()
    L.mx += ((o.pointerX - rc.left) * dpr - L.mx) * 0.06
    L.my += ((rc.bottom - o.pointerY) * dpr - L.my) * 0.06
  }
  const key = `${w}|${h}|${o.color.join(',')}`
  if (o.still && L.key === key) return
  L.key = key
  const aspect = w / h
  gl.viewport(0, 0, w, h)
  gl.uniform2f(L.u.r, w, h)
  gl.uniform1f(L.u.t, o.time)
  gl.uniform2f(L.u.m, L.mx, L.my)
  gl.uniform2f(L.u.nm, (L.mx / w) * 2 - 1, (L.my / h) * 2 - 1)
  gl.uniform3f(L.u.acc, o.color[0], o.color[1], o.color[2])
  gl.uniform1f(L.u.sc, o.scroll)
  if (aspect > 1.15) gl.uniform2f(L.u.ctr, aspect * 0.18, 0.0)
  else gl.uniform2f(L.u.ctr, 0.1, 0.45)
  gl.drawArrays(gl.TRIANGLES, 0, 3)
}
