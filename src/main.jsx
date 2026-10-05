import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  LayoutDashboard, ArrowLeftRight, WalletCards, TrendingUp, TrendingDown,
  ClipboardCheck, FileBarChart2, Settings, Search, Bell, Plus,
  Download, ChevronDown, Menu, X, CircleDollarSign, Receipt,
  ArrowUpRight, ArrowDownRight, CalendarDays, Filter, Eye, Pencil,
  Trash2, CheckCircle2, AlertTriangle, Building2
} from "lucide-react";
import "./styles.css";

const movimientosIniciales = [
  { id: 1, fecha: "02/06/2026", tipo: "Ingreso", recibo: "R-0001", stand: "A-01", concepto: "Pago cuota junio", categoria: "Cuotas", ingreso: 500, egreso: 0, saldo: 500 },
  { id: 2, fecha: "03/06/2026", tipo: "Ingreso", recibo: "R-0002", stand: "A-02", concepto: "Pago cuota junio", categoria: "Cuotas", ingreso: 500, egreso: 0, saldo: 1000 },
  { id: 3, fecha: "04/06/2026", tipo: "Egreso", recibo: "E-0001", stand: "-", concepto: "Compra de materiales", categoria: "Materiales", ingreso: 0, egreso: 120, saldo: 880 },
  { id: 4, fecha: "05/06/2026", tipo: "Ingreso", recibo: "R-0003", stand: "B-04", concepto: "Pago mantenimiento", categoria: "Mantenimiento", ingreso: 350, egreso: 0, saldo: 1230 },
  { id: 5, fecha: "07/06/2026", tipo: "Egreso", recibo: "E-0002", stand: "-", concepto: "Servicio de limpieza", categoria: "Servicios", ingreso: 0, egreso: 180, saldo: 1050 },
  { id: 6, fecha: "09/06/2026", tipo: "Ingreso", recibo: "R-0004", stand: "C-08", concepto: "Pago cuota junio", categoria: "Cuotas", ingreso: 450, egreso: 0, saldo: 1500 },
  { id: 7, fecha: "10/06/2026", tipo: "Egreso", recibo: "E-0003", stand: "-", concepto: "Compra de útiles", categoria: "Materiales", ingreso: 0, egreso: 95, saldo: 1405 },
  { id: 8, fecha: "12/06/2026", tipo: "Ingreso", recibo: "R-0005", stand: "D-02", concepto: "Adelanto", categoria: "Adelantos", ingreso: 700, egreso: 0, saldo: 2105 }
];

const menu = [
  ["dashboard", "Dashboard", LayoutDashboard],
  ["movimientos", "Movimientos", ArrowLeftRight],
  ["kardex", "Kardex de Caja", WalletCards],
  ["ingresos", "Ingresos", TrendingUp],
  ["egresos", "Egresos", TrendingDown],
  ["arqueos", "Arqueos", ClipboardCheck],
  ["reportes", "Reportes", FileBarChart2],
  ["config", "Configuración", Settings]
];

const money = n => `S/ ${Number(n).toLocaleString("es-PE", {minimumFractionDigits:2, maximumFractionDigits:2})}`;

function App() {
  const [page, setPage] = useState("dashboard");
  const [sidebar, setSidebar] = useState(true);
  const [movimientos, setMovimientos] = useState(movimientosIniciales);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("Ingreso");
  const [search, setSearch] = useState("");

  const totals = useMemo(() => {
    const ingresos = movimientos.reduce((s,m) => s + m.ingreso, 0);
    const egresos = movimientos.reduce((s,m) => s + m.egreso, 0);
    return { ingresos, egresos, saldo: ingresos - egresos };
  }, [movimientos]);

  const addMovimiento = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const ingreso = modalType === "Ingreso" ? Number(fd.get("monto")) : 0;
    const egreso = modalType === "Egreso" ? Number(fd.get("monto")) : 0;
    const previous = movimientos.length ? movimientos[movimientos.length-1].saldo : 0;
    const nuevo = {
      id: Date.now(),
      fecha: fd.get("fecha"),
      tipo: modalType,
      recibo: fd.get("recibo") || "-",
      stand: fd.get("stand") || "-",
      concepto: fd.get("concepto"),
      categoria: fd.get("categoria"),
      ingreso, egreso,
      saldo: previous + ingreso - egreso
    };
    setMovimientos([...movimientos, nuevo]);
    setShowModal(false);
  };

  const filtered = movimientos.filter(m =>
    `${m.concepto} ${m.recibo} ${m.categoria} ${m.stand}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <aside className={`sidebar ${sidebar ? "" : "collapsed"}`}>
        <div className="brand">
          <div className="brand-icon"><CircleDollarSign size={24}/></div>
          {sidebar && <div><strong>Kardex Caja</strong><span>Control financiero</span></div>}
        </div>

        <nav>
          {menu.map(([id,label,Icon]) => (
            <button key={id} className={page === id ? "nav-item active" : "nav-item"} onClick={() => setPage(id)}>
              <Icon size={19}/>{sidebar && <span>{label}</span>}
            </button>
          ))}
        </nav>

        {sidebar && <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon"><Building2 size={18}/></div>
            <div><b>San Rafael</b><small>Administración</small></div>
          </div>
        </div>}
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="icon-btn" onClick={() => setSidebar(!sidebar)}>{sidebar ? <X size={20}/> : <Menu size={20}/>}</button>
          <div className="breadcrumb"><span>Control de Caja</span><b>/</b><strong>{menu.find(x => x[0]===page)?.[1]}</strong></div>
          <div className="top-actions">
            <button className="icon-btn"><Bell size={19}/><i></i></button>
            <div className="avatar">SM</div>
            <div className="user-name">Sra. Milagros <small>Administradora</small></div>
            <ChevronDown size={16}/>
          </div>
        </header>

        <div className="content">
          {page === "dashboard" && <Dashboard totals={totals} movimientos={movimientos} setPage={setPage}/>}
          {page === "movimientos" && <Movimientos filtered={filtered} search={search} setSearch={setSearch} open={() => {setModalType("Ingreso");setShowModal(true)}}/>}
          {page === "kardex" && <Kardex movimientos={filtered} search={search} setSearch={setSearch}/>}
          {page === "ingresos" && <TipoPage type="Ingreso" movimientos={movimientos} open={() => {setModalType("Ingreso");setShowModal(true)}}/>}
          {page === "egresos" && <TipoPage type="Egreso" movimientos={movimientos} open={() => {setModalType("Egreso");setShowModal(true)}}/>}
          {page === "arqueos" && <Arqueos saldo={totals.saldo}/>}
          {page === "reportes" && <Reportes totals={totals}/>}
          {page === "config" && <Config/>}
        </div>
      </main>

      {showModal && <Modal type={modalType} close={() => setShowModal(false)} submit={addMovimiento}/>}
    </div>
  );
}

function PageTitle({title, subtitle, action}) {
  return <div className="page-title">
    <div><h1>{title}</h1><p>{subtitle}</p></div>
    {action}
  </div>
}

function Dashboard({totals,movimientos,setPage}) {
  const recent = movimientos.slice(-5).reverse();
  return <>
    <PageTitle title="Dashboard" subtitle="Resumen general del movimiento de caja"
      action={<button className="primary" onClick={() => setPage("movimientos")}><Plus size={18}/> Nuevo movimiento</button>}/>
    <div className="kpis">
      <Kpi title="Saldo actual" value={money(totals.saldo)} icon={WalletCards} trend="+8.4%" good/>
      <Kpi title="Ingresos" value={money(totals.ingresos)} icon={TrendingUp} trend="+12.6%" good/>
      <Kpi title="Egresos" value={money(totals.egresos)} icon={TrendingDown} trend="-3.2%" good/>
      <Kpi title="Movimientos" value={movimientos.length} icon={Receipt} trend="Este periodo"/>
    </div>
    <div className="grid-2">
      <section className="panel chart-panel">
        <div className="panel-head"><div><h3>Ingresos vs. egresos</h3><p>Comportamiento del periodo</p></div><select><option>Últimos 30 días</option><option>Este mes</option></select></div>
        <FakeChart ingresos={totals.ingresos} egresos={totals.egresos}/>
      </section>
      <section className="panel">
        <div className="panel-head"><div><h3>Distribución</h3><p>Composición de los egresos</p></div></div>
        <div className="donut-wrap"><div className="donut"><div><b>100%</b><span>Egresos</span></div></div><div className="legend">
          <span><i className="dot d1"></i> Servicios <b>38%</b></span>
          <span><i className="dot d2"></i> Materiales <b>27%</b></span>
          <span><i className="dot d3"></i> Mantenimiento <b>21%</b></span>
          <span><i className="dot d4"></i> Otros <b>14%</b></span>
        </div></div>
      </section>
    </div>
    <section className="panel">
      <div className="panel-head"><div><h3>Últimos movimientos</h3><p>Actividad registrada recientemente</p></div><button className="text-btn" onClick={() => setPage("kardex")}>Ver kardex completo →</button></div>
      <MovementTable data={recent}/>
    </section>
  </>;
}

function Kpi({title,value,icon:Icon,trend,good}) {
  return <div className="kpi"><div className="kpi-top"><span>{title}</span><div className="kpi-icon"><Icon size={20}/></div></div><strong>{value}</strong><small className={good ? "positive":""}>{good && <ArrowUpRight size={14}/>} {trend}</small></div>
}

function FakeChart({ingresos,egresos}) {
  const bars = [38,52,45,68,57,76,64,88,72,94,82,100];
  return <div className="chart"><div className="chart-y"><span>100k</span><span>75k</span><span>50k</span><span>25k</span><span>0</span></div><div className="bars">{bars.map((h,i)=><div className="bar-group" key={i}><div className="bar income" style={{height:`${h}%`}}></div><div className="bar expense" style={{height:`${Math.max(12,h*.58)}%`}}></div><small>{i+1}</small></div>)}</div><div className="chart-labels"><span><i className="legend-income"></i>Ingresos {money(ingresos)}</span><span><i className="legend-expense"></i>Egresos {money(egresos)}</span></div></div>
}

function MovementTable({data}) {
 return <div className="table-wrap"><table><thead><tr><th>Fecha</th><th>Tipo</th><th>Recibo</th><th>Stand</th><th>Concepto</th><th>Ingreso</th><th>Egreso</th><th>Saldo</th></tr></thead><tbody>
 {data.map(m=><tr key={m.id}><td>{m.fecha}</td><td><span className={`badge ${m.tipo==="Ingreso"?"in":"out"}`}>{m.tipo}</span></td><td>{m.recibo}</td><td>{m.stand}</td><td>{m.concepto}</td><td className="money income-text">{m.ingreso?money(m.ingreso):"—"}</td><td className="money expense-text">{m.egreso?money(m.egreso):"—"}</td><td className="money">{money(m.saldo)}</td></tr>)}
 </tbody></table></div>
}

function Movimientos({filtered,search,setSearch,open}) {
 return <><PageTitle title="Movimientos" subtitle="Registra y consulta todos los movimientos de caja" action={<button className="primary" onClick={open}><Plus size={18}/> Registrar movimiento</button>}/>
 <div className="toolbar"><div className="search"><Search size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar por concepto, recibo o stand..."/></div><button className="secondary"><Filter size={17}/> Filtros</button><button className="secondary"><Download size={17}/> Exportar</button></div>
 <section className="panel"><MovementTable data={filtered}/></section></>
}

function Kardex({movimientos,search,setSearch}) {
 return <><PageTitle title="Kardex de Caja" subtitle="Control cronológico de ingresos, egresos y saldo acumulado" action={<button className="secondary"><Download size={18}/> Exportar Excel</button>}/>
 <div className="summary-strip"><div><span>Saldo inicial</span><b>S/ 0.00</b></div><div><span>Total ingresos</span><b className="income-text">{money(movimientos.reduce((s,m)=>s+m.ingreso,0))}</b></div><div><span>Total egresos</span><b className="expense-text">{money(movimientos.reduce((s,m)=>s+m.egreso,0))}</b></div><div><span>Saldo final</span><b>{money(movimientos.at(-1)?.saldo || 0)}</b></div></div>
 <div className="toolbar"><div className="search"><Search size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar en el kardex..."/></div><button className="secondary"><CalendarDays size={17}/> Periodo</button></div>
 <section className="panel"><MovementTable data={movimientos}/></section></>
}

function TipoPage({type,movimientos,open}) {
 const data=movimientos.filter(m=>m.tipo===type);
 const total=data.reduce((s,m)=>s+(type==="Ingreso"?m.ingreso:m.egreso),0);
 return <><PageTitle title={type==="Ingreso"?"Ingresos":"Egresos"} subtitle={type==="Ingreso"?"Control de dinero recibido":"Control de pagos y salidas de caja"} action={<button className="primary" onClick={open}><Plus size={18}/> Nuevo {type.toLowerCase()}</button>}/>
 <div className="kpis compact"><Kpi title={`Total ${type.toLowerCase()}s`} value={money(total)} icon={type==="Ingreso"?TrendingUp:TrendingDown} trend={`${data.length} registros`} good={type==="Ingreso"}/><Kpi title="Este mes" value={money(total)} icon={CalendarDays} trend="Junio 2026"/></div>
 <section className="panel"><MovementTable data={data}/></section></>
}

function Arqueos({saldo}) {
 return <><PageTitle title="Arqueos de Caja" subtitle="Compara el saldo del sistema con el dinero físico" action={<button className="primary"><Plus size={18}/> Nuevo arqueo</button>}/>
 <div className="grid-2"><section className="panel form-panel"><div className="panel-head"><div><h3>Arqueo del día</h3><p>05 de octubre de 2026</p></div><span className="badge pending">Pendiente</span></div><label>Saldo según sistema<input value={money(saldo)} readOnly/></label><label>Dinero físico<input placeholder="S/ 0.00"/></label><label>Diferencia<input placeholder="Se calculará automáticamente" readOnly/></label><label>Observación<textarea placeholder="Ingrese una observación..."></textarea></label><button className="primary full"><CheckCircle2 size={18}/> Registrar arqueo</button></section>
 <section className="panel"><h3>Últimos arqueos</h3><div className="audit-list"><Audit date="30/09/2026" amount="S/ 15,550.60" status="Cuadrado"/><Audit date="29/09/2026" amount="S/ 14,980.60" status="Cuadrado"/><Audit date="28/09/2026" amount="S/ 14,420.60" status="Cuadrado"/><Audit date="27/09/2026" amount="S/ 13,920.60" status="Observado"/></div></section></div></>
}

function Audit({date,amount,status}) { return <div className="audit"><div className="calendar-mini"><b>{date.split("/")[0]}</b><small>SEP</small></div><div><b>{date}</b><span>Saldo registrado: {amount}</span></div><span className={status==="Cuadrado"?"status ok":"status warn"}>{status}</span></div> }

function Reportes({totals}) {
 return <><PageTitle title="Reportes" subtitle="Genera información financiera para revisión y archivo"/>
 <section className="panel filters"><h3>Generar reporte</h3><div className="filter-grid"><label>Desde<input type="date" defaultValue="2026-06-01"/></label><label>Hasta<input type="date" defaultValue="2026-09-30"/></label><label>Tipo<select><option>Todos</option><option>Ingresos</option><option>Egresos</option></select></label><label>Categoría<select><option>Todas</option><option>Cuotas</option><option>Servicios</option><option>Materiales</option></select></label></div><div className="report-actions"><button className="primary"><FileBarChart2 size={18}/> Generar reporte</button><button className="secondary"><Download size={18}/> Excel</button><button className="secondary"><Download size={18}/> PDF</button></div></section>
 <div className="grid-3"><ReportCard title="Kardex completo" desc="Detalle cronológico de todos los movimientos" icon={WalletCards}/><ReportCard title="Resumen financiero" desc="Ingresos, egresos y saldo por periodo" icon={FileBarChart2}/><ReportCard title="Arqueos" desc="Historial de cierres y diferencias" icon={ClipboardCheck}/></div></>
}

function ReportCard({title,desc,icon:Icon}) {return <div className="report-card"><div className="report-icon"><Icon size={22}/></div><h3>{title}</h3><p>{desc}</p><button className="text-btn">Generar →</button></div>}

function Config() {
 return <><PageTitle title="Configuración" subtitle="Parámetros generales del sistema"/>
 <div className="grid-2"><section className="panel form-panel"><h3>Datos de la administración</h3><label>Nombre<input defaultValue="Junta de Propietarios San Rafael"/></label><label>Responsable<input defaultValue="Sra. Milagros"/></label><label>Moneda<select><option>Soles (S/)</option></select></label><button className="primary">Guardar cambios</button></section><section className="panel form-panel"><h3>Categorías</h3><div className="category">Cuotas <button><Trash2 size={16}/></button></div><div className="category">Servicios <button><Trash2 size={16}/></button></div><div className="category">Materiales <button><Trash2 size={16}/></button></div><div className="category">Mantenimiento <button><Trash2 size={16}/></button></div><button className="secondary"><Plus size={17}/> Nueva categoría</button></section></div></>
}

function Modal({type,close,submit}) {
 return <div className="overlay"><div className="modal"><div className="modal-head"><div><h2>Registrar {type.toLowerCase()}</h2><p>Complete los datos del movimiento</p></div><button onClick={close}><X/></button></div><form onSubmit={submit}><div className="form-grid"><label>Fecha<input type="date" name="fecha" defaultValue="2026-10-05" required/></label><label>N.º recibo<input name="recibo" placeholder="R-0000"/></label><label>N.º stand<input name="stand" placeholder="A-01"/></label><label>Categoría<select name="categoria"><option>Cuotas</option><option>Servicios</option><option>Materiales</option><option>Mantenimiento</option><option>Adelantos</option><option>Otros</option></select></label></div><label>Concepto<input name="concepto" placeholder="Descripción del movimiento" required/></label><label>Monto (S/)<input name="monto" type="number" step="0.01" min="0.01" placeholder="0.00" required/></label><div className="modal-actions"><button type="button" className="secondary" onClick={close}>Cancelar</button><button className="primary" type="submit"><CheckCircle2 size={18}/> Guardar {type.toLowerCase()}</button></div></form></div></div>
}

createRoot(document.getElementById("root")).render(<App />);
