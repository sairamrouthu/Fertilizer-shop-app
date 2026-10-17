// 1) Replace these with Project Settings > API values from your own Supabase project.
// Use only the public anon/publishable key in browser code. Never use service_role here.
const SUPABASE_URL = "https://oqacmvkzmburkhwgdfzx.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_xMfPhQAne3SF9PLcpfPQqA_uuX2SRdx";
let sb = null, currentUser = null, farmers = [], products = [], sales = [], payments = [], language = "en";
const money = n => "₹" + Number(n || 0).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2});
const $ = id => document.getElementById(id);
function setup(){if(SUPABASE_URL.startsWith("http") && !SUPABASE_URL.includes("YOUR_") && !SUPABASE_ANON_KEY.includes("YOUR_")){sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY);$("setup").classList.add("hidden");$("auth").classList.remove("hidden");checkSession()}else{$("setup").classList.remove("hidden")}}
async function checkSession(){const {data:{session}}=await sb.auth.getSession();if(session){currentUser=session.user;await enterApp()}else{$("auth").classList.remove("hidden");$("app").classList.add("hidden")}}
async function signIn(){let {error}=await sb.auth.signInWithPassword({email:$("email").value,password:$("password").value});$("authMsg").textContent=error?error.message:"Signed in";if(!error)await checkSession()}
async function signUp(){let {error}=await sb.auth.signUp({email:$("email").value,password:$("password").value});$("authMsg").textContent=error?error.message:"Account created. Check email if confirmation is enabled, then sign in."}
async function logout(){await sb.auth.signOut();currentUser=null;$("app").classList.add("hidden");$("auth").classList.remove("hidden")}
async function enterApp(){$("auth").classList.add("hidden");$("app").classList.remove("hidden");$("signout").classList.remove("hidden");await loadAll()}
function view(id){document.querySelectorAll(".view").forEach(x=>x.classList.add("hidden"));$(id).classList.remove("hidden")}
function toggleLang(){language=language==="en"?"te":"en";alert(language==="te"?"ప్రాథమిక స్క్రీన్‌లలో తెలుగు/English కలిపి ఉన్నాయి. పూర్తి అనువాదం తదుపరి దశలో జోడించవచ్చు.":"Core screens currently use mixed Telugu/English. Full localization can be added next.")}
function msg(e){alert(e?.message||String(e))}
async function loadAll(){if(!sb||!currentUser)return;try{
 let results=await Promise.all([sb.from("farmers").select("*").order("created_at",{ascending:false}),sb.from("products").select("*").order("name"),sb.from("sales").select("*").order("created_at",{ascending:false}).limit(200),sb.from("payments").select("*").order("created_at",{ascending:false}).limit(200)]);
 for(const r of results)if(r.error)throw r.error;
 [farmers,products,sales,payments]=results.map(r=>r.data||[]);render();
 }catch(e){msg(e)}}
function farmerLabel(id){return farmers.find(f=>f.id===id)?.name||"—"}
function farmerBalance(id){return sales.filter(s=>s.farmer_id===id).reduce((a,s)=>a+Number(s.total)-Number(s.paid),0)-payments.filter(p=>p.farmer_id===id).reduce((a,p)=>a+Number(p.amount),0)}
function render(){ $("farmerRows").innerHTML=farmers.map(f=>`<tr><td>${f.farmer_code||"—"}</td><td>${safe(f.name)}</td><td>${safe(f.phone||"")}</td><td>${safe(f.village||"")}</td><td>${money(farmerBalance(f.id))}</td></tr>`).join("");
$("productRows").innerHTML=products.map(p=>`<tr><td>${safe(p.name)}<br><small>${safe(p.category||"")}</small></td><td>${safe(p.batch_no||"")}</td><td>${p.quantity} ${safe(p.unit||"")}</td><td>${money(p.purchase_price)}</td><td>${money(p.selling_price)}</td><td>${safe(p.expiry_date||"")}</td></tr>`).join("");
const options=arr=>'<option value="">Select…</option>'+arr.map(x=>`<option value="${x.id}">${safe(x.name)}</option>`).join("");
$("sFarmer").innerHTML=options(farmers);$("payFarmer").innerHTML=options(farmers);$("sProduct").innerHTML='<option value="">Select…</option>'+products.map(p=>`<option value="${p.id}">${safe(p.name)} · stock ${p.quantity}</option>`).join("");
$("saleRows").innerHTML=sales.map(s=>`<tr><td>${s.sale_date||""}</td><td>${s.bill_no||s.id.slice(0,8)}</td><td>${safe(farmerLabel(s.farmer_id))}</td><td>${money(s.total)}</td><td>${money(s.paid)}</td><td>${money(Number(s.total)-Number(s.paid))}</td></tr>`).join("");
$("paymentRows").innerHTML=payments.map(p=>`<tr><td>${p.payment_date||""}</td><td>${safe(farmerLabel(p.farmer_id))}</td><td>${money(p.amount)}</td><td>${safe(p.mode||"")}</td></tr>`).join("");
const due=farmers.reduce((a,f)=>a+farmerBalance(f.id),0),today=new Date().toISOString().slice(0,10),todaySales=sales.filter(s=>s.sale_date===today);
$("stats").innerHTML=[[ "Today's sales",money(todaySales.reduce((a,s)=>a+Number(s.total),0))],["Farmers",farmers.length],["Outstanding balance",money(due)],["Products",products.length]].map(x=>`<div class="stat"><small>${x[0]}</small><strong>${x[1]}</strong></div>`).join("");
}
function safe(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
async function addFarmer(){try{let name=$("fName").value.trim();if(!name)return alert("Farmer name required");let {error}=await sb.from("farmers").insert({name,phone:$("fPhone").value.trim()||null,village:$("fVillage").value.trim()||null});if(error)throw error;$("fName").value=$("fPhone").value=$("fVillage").value="";await loadAll()}catch(e){msg(e)}}
async function addProduct(){try{let name=$("pName").value.trim(),qty=Number($("pQty").value),sell=Number($("pSell").value);if(!name||qty<=0||sell<0)return alert("Enter valid product, quantity and selling price");let {error}=await sb.from("products").insert({name,category:$("pCategory").value,batch_no:$("pBatch").value||null,expiry_date:$("pExpiry").value||null,purchase_price:Number($("pBuy").value||0),selling_price:sell,quantity:qty,unit:$("pUnit").value});if(error)throw error;["pName","pBatch","pExpiry","pSell","pQty"].forEach(id=>$(id).value="");await loadAll()}catch(e){msg(e)}}
function fillPrice(){let p=products.find(p=>p.id===$("sProduct").value);if(p)$("sPrice").value=p.selling_price}
async function createSale(){try{let farmer_id=$("sFarmer").value,product_id=$("sProduct").value,quantity=Number($("sQty").value),unit_price=Number($("sPrice").value),paid=Number($("sPaid").value);if(!farmer_id||!product_id||quantity<=0||unit_price<0||paid<0)return alert("Complete all sale fields");let {data,error}=await sb.rpc("create_sale",{p_farmer_id:farmer_id,p_product_id:product_id,p_quantity:quantity,p_unit_price:unit_price,p_paid:paid,p_payment_mode:$("sMode").value});if(error)throw error;$("saleMsg").textContent="Sale saved. Bill ID: "+(data?.bill_no||data?.id||"created");await loadAll()}catch(e){msg(e)}}
async function addPayment(){try{let farmer_id=$("payFarmer").value,amount=Number($("payAmount").value);if(!farmer_id||amount<=0)return alert("Select farmer and enter a valid amount");let {error}=await sb.from("payments").insert({farmer_id,amount,mode:$("payMode").value,payment_date:$("payDate").value||new Date().toISOString().slice(0,10)});if(error)throw error;$("payAmount").value="";await loadAll()}catch(e){msg(e)}}
setup();
