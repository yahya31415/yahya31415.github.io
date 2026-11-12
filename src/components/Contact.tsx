import { contact } from '../content'

export function Contact() {
  return (
    <footer id="contact">
      <canvas data-gl="terrain" className="gl" aria-hidden="true" />
      <div className="contact-scrim" aria-hidden="true" />
      <div className="contact-body">
        <div className="label warm" data-sx>06 / Contact</div>
        <h2 className="display huge" data-rv>Got something that needs building properly?</h2>
        <div className="btns" data-rv>
          <a className="btn primary big mag" href={`mailto:${contact.email}`}>{contact.email}</a>
          <a className="btn big mag" href={contact.linkedin}>LinkedIn</a>
          <a className="btn big mag" href={contact.github}>GitHub</a>
        </div>
      </div>
      <div className="contact-foot mono">
        <span>Yahya Ayash Luqman</span>
        <span>Designed and built in Bengaluru</span>
      </div>
    </footer>
  )
}
