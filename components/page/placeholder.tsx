import Footer from "../Footer";

const PlaceholderPage = ({ title, description, setPage }: { title: string; description: string; setPage: (page: string) => void }) => (
  <div>
    <div className="page-wrap section">
      <h1 style={{fontSize:48,marginBottom:12}}>{title}</h1>
      <p style={{fontSize:17,color:"#6B6B7A",marginBottom:28}}>{description}</p>
      <button className="btn btn-outline" onClick={()=>setPage("home")}>← Back to Home</button>
    </div>
    <Footer setPage={setPage}/>
  </div>
);

export default PlaceholderPage;