import TrafficLights from "./TrafficLights";

const Modal = ({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) => (
  <div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
    <div className="modal-box">
      <div className="modal-header">
        <div className="window-titlebar" style={{border:"none",padding:0,background:"none",flex:1}}>
          <TrafficLights/>
          <span className="titlebar-label" style={{marginLeft:8}}>{title}</span>
        </div>
        <button className="modal-close" onClick={onClose}>×</button>
      </div>
      <div className="modal-body">{children}</div>
    </div>
  </div>
);

export default Modal;