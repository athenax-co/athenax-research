import Link from "next/link";
import WindowCard from "../ui/WindowCard";
import { DocSection, DocsShell } from "../ui/Docs";
 

const DocsMediaPage = () => {
  const mediaLogos = [
    { title:"Primary Lockup", src:"Logo_Dark.svg", bg:"#F2EFE9", bodyClass:"window-body" },
    { title:"Inverse Lockup", src:"Logo_White.svg", bg:"#1C1C27", bodyClass:"window-body", dark:true },
    { title:"Accent Lockup", src:"Logo_Yellow.svg", bg:"#1C1C27", bodyClass:"window-body", dark:true },
    { title:"Icon Mark", src:"Logo.svg", bg:"#F2EFE9", bodyClass:"window-body" },
  ];

  const palette = [
    { name:"Primary Red", hex:"#E8323C", bg:"#E8323C", fg:"#F2EFE9", use:"Primary accents, calls to action, and key emphasis" },
    { name:"Near-Black", hex:"#1C1C27", bg:"#1C1C27", fg:"#F2EFE9", use:"Primary text, strokes, dark surfaces" },
    { name:"Cream", hex:"#F2EFE9", bg:"#F2EFE9", fg:"#1C1C27", use:"Page fields, neutral canvas, and brand background" },
    { name:"Yellow", hex:"#F5D94E", bg:"#F5D94E", fg:"#1C1C27", use:"Labels, highlights, and category markers" },
  ];

  const usageGood = [
    "Use the supplied lockups and icon files without distortion.",
    "Keep generous clear space around the mark in crowded layouts.",
    "Pair the brand with high-contrast surfaces and strong typography.",
    "Attribute AthenaX accurately when describing sponsorship or partnership.",
  ];

  const usageBad = [
    "Do not redraw, stretch, skew, or rotate the symbol.",
    "Do not invent gradients, shadows, or alternate colorways.",
    "Do not imply endorsement, investment, or partnership unless confirmed.",
    "Do not combine the mark with unrelated icons into a new hybrid logo.",
  ];

  return (
    <DocsShell current="docs-media" title="Media Kit" subtitle="Press-ready assets, voice notes, and brand usage for partners, media, and ecosystem teams." fileTag="/root/docs/media-kit">
      <div className="section-stack-lg">
        <WindowCard label="MEDIA_KIT_OVERVIEW" bodyClass="window-body window-body-yellow">
          <div style={{display:"grid",gridTemplateColumns:"1.2fr 0.8fr",gap:24,alignItems:"start"}}>
            <div>
              <div className="path-badge" style={{marginBottom:14}}>CC0 / OPEN BRAND SYSTEM</div>
              <h2 style={{fontSize:34,lineHeight:1.02,marginBottom:12}}>AthenaX Press & Brand Pack</h2>
              <p style={{fontSize:15,color:"#6B6B7A",lineHeight:1.7,marginBottom:18}}>
                AthenaX is a research coordination system for frontier technology. This media kit gives editors, sponsors, and builders a clean way to talk about the project and use the brand responsibly.
              </p>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:18}}>
                {["CC0 assets","Logo lockups","Palette","Voice notes","Usage rules"].map((item)=>(
                  <span key={item} className="ftag">{item}</span>
                ))}
              </div>
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                <Link href="https://athenax.mypinx.store/Brand/Brand%20Guidelines.pdf" target="_blank" rel="noopener noreferrer">
                  <button className="btn btn-primary">Download Brand PDF</button>
                </Link>
                <Link href="/launch"><button className="btn btn-outline">See Product Surface</button></Link>
              </div>
            </div>
            <div className="stat-card" style={{background:"#fff"}}>
              <div className="stat-label">Boilerplate</div>
              <div style={{fontSize:14,lineHeight:1.75,color:"#1C1C27"}}>
                AthenaX connects researchers, builders, and protocol ecosystems so validated ideas can move from paper to product. It is designed to make open research fundable, legible, and easier to build on.
              </div>
            </div>
          </div>
        </WindowCard>

        <DocSection title="Logo System">
          <div className="grid-2" style={{gap:18}}>
            {mediaLogos.map((logo)=>(
              <WindowCard key={logo.title} label={logo.title.toUpperCase().replace(/ /g,"_")} bodyClass={logo.bodyClass}>
                <div style={{background:logo.bg,border:"2px solid #1C1C27",borderRadius:12,padding:"28px 24px",display:"flex",alignItems:"center",justifyContent:"center",minHeight:180}}>
                  <img
                    src={`https://athenax.mypinx.store/Brand/${logo.src}`}
                    alt={logo.title}
                    width={520}
                    height={240}
                    style={{width:logo.title === "Icon Mark" ? 180 : "78%",height:"auto",display:"block"}}
                  />
                </div>
                <div style={{marginTop:14,fontSize:13,color:"#6B6B7A",lineHeight:1.65}}>
                  {logo.title === "Primary Lockup" && "Default mark for editorial coverage, decks, landing pages, and ecosystem references."}
                  {logo.title === "Inverse Lockup" && "Use on dark surfaces where maximum legibility is needed."}
                  {logo.title === "Accent Lockup" && "Best for highlighted placements, feature cards, and branded modules."}
                  {logo.title === "Icon Mark" && "Use the icon on its own in tight UI contexts or social/profile placements."}
                </div>
              </WindowCard>
            ))}
          </div>
        </DocSection>

        <DocSection title="Palette & Voice">
          <div className="grid-2" style={{gap:18,alignItems:"start"}}>
            <WindowCard label="PALETTE.TOKENS" bodyClass="window-body window-body-blue">
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {palette.map((color)=>(
                  <div key={color.name} style={{display:"grid",gridTemplateColumns:"88px 1fr",gap:14,alignItems:"center",padding:"10px 0",borderBottom:"1px solid rgba(31,41,55,0.08)"}}>
                    <div style={{height:52,borderRadius:10,border:"2px solid #1C1C27",background:color.bg,boxShadow:"3px 3px 0 #1C1C27"}}/>
                    <div>
                      <div style={{fontWeight:700,fontSize:14,color:"#1C1C27"}}>{color.name} <span style={{fontFamily:"'Space Mono',monospace",fontSize:11,color:"#6B6B7A"}}>{color.hex}</span></div>
                      <div style={{fontSize:13,color:"#6B6B7A",lineHeight:1.55}}>{color.use}</div>
                    </div>
                  </div>
                ))}
              </div>
            </WindowCard>

            <WindowCard label="VOICE_AND_COPY" bodyClass="window-body">
              <div style={{fontSize:14,lineHeight:1.8,color:"#1C1C27"}}>
                <div style={{marginBottom:12}}><strong>Core tone:</strong> rigorous, open, builder-literate, quietly ambitious.</div>
                <div style={{marginBottom:12}}><strong>Preferred language:</strong> research coordination, protocol ecosystems, public goods, frontier technology, open infrastructure.</div>
                <div style={{marginBottom:12}}><strong>Avoid:</strong> vague hype language, empty futurism, or framing AthenaX as just another media/news brand.</div>
                <div style={{marginBottom:16}}><strong>Short descriptor:</strong> AthenaX is a research operating system for frontier technology.</div>
                <div className="stat-card" style={{background:"#F2EFE9",padding:16}}>
                  <div className="stat-label">Recommended quote</div>
                  <div style={{fontSize:15,lineHeight:1.7}}>
                    “AthenaX helps serious research travel farther by giving it structure, visibility, and a path into products.”
                  </div>
                </div>
              </div>
            </WindowCard>
          </div>
        </DocSection>

        <DocSection title="Usage Rules">
          <div className="grid-2" style={{gap:18}}>
            <WindowCard label="DO" bodyClass="window-body window-body-yellow">
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                {usageGood.map((item, index)=>(
                  <div key={item} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                    <div style={{width:30,height:30,borderRadius:8,border:"2px solid #1C1C27",background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,boxShadow:"2px 2px 0 #1C1C27"}}>{index + 1}</div>
                    <div style={{fontSize:14,lineHeight:1.7,color:"#1C1C27"}}>{item}</div>
                  </div>
                ))}
              </div>
            </WindowCard>

            <WindowCard label="DO_NOT" bodyClass="window-body">
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                {usageBad.map((item, index)=>(
                  <div key={item} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                    <div style={{width:30,height:30,borderRadius:8,border:"2px solid #1C1C27",background:"#F5DDE0",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,boxShadow:"2px 2px 0 #1C1C27",color:"#E8323C"}}>{index + 1}</div>
                    <div style={{fontSize:14,lineHeight:1.7,color:"#1C1C27"}}>{item}</div>
                  </div>
                ))}
              </div>
            </WindowCard>
          </div>
        </DocSection>

        <DocSection title="Press Contact & Downloads">
          <div className="grid-2" style={{gap:18}}>
            <WindowCard label="PRESS_CONTACT" bodyClass="window-body">
              <div style={{fontSize:14,lineHeight:1.8,color:"#1C1C27"}}>
                <div style={{marginBottom:10}}><strong>Email:</strong> <a href="mailto:info@athenax.co" style={{color:"#E8323C",textDecoration:"underline"}}>info@athenax.co</a></div>
                <div style={{marginBottom:10}}><strong>Best for:</strong> press requests, partner decks, conference materials, podcast notes, sponsorship references.</div>
                <div><strong>Licence:</strong> CC0. Assets are open to use, adapt, and distribute, but usage must not falsely imply endorsement or a formal partnership.</div>
              </div>
            </WindowCard>

            <WindowCard label="DOWNLOADS" bodyClass="window-body window-body-blue">
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                <Link href="https://athenax.mypinx.store/Brand/Brand%20Guidelines.pdf" target="_blank" rel="noopener noreferrer">
                  <button className="btn btn-primary" style={{width:"100%",justifyContent:"center"}}>Download Brand Guidelines PDF</button>
                </Link>
                <Link href="https://athenax.mypinx.store/Brand/Logo.svg" target="_blank" rel="noopener noreferrer">
                  <button className="btn btn-outline" style={{width:"100%",justifyContent:"center"}}>Download SVG Mark</button>
                </Link>
                <Link href="https://athenax.mypinx.store/Brand/Logo_Dark.svg" target="_blank" rel="noopener noreferrer">
                  <button className="btn btn-outline" style={{width:"100%",justifyContent:"center"}}>Download Primary Lockup</button>
                </Link>
              </div>
            </WindowCard>
          </div>
        </DocSection>
      </div>
    </DocsShell>
  );
};

export default DocsMediaPage;