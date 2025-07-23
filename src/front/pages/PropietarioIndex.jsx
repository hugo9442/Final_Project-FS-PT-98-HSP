import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { apartments } from "../fecht_apartment.js";
import { users } from "../fecht_user.js";
import { Issues } from "../fecht_issues.js";
import { dashboard } from "../fecht_dashboard.js";
import { expenses } from "../fecht_expenses.js"; // <-- Import para gastos

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  Line
} from 'recharts';

const PropietarioIndex = () => {
  const [totalViviendas, setTotalViviendas] = useState(0);
  const [totalContratos, setTotalContratos] = useState(0);
  const [totalIncidencias, setTotalIncidencias] = useState(0);
  const [facturacionMensual, setFacturacionMensual] = useState([]);
  const [gastosMensuales, setGastosMensuales] = useState([]);
  const [dataCombinada, setDataCombinada] = useState([]);
  const [rentabilidadAnual, setRentabilidadAnual] = useState(0);
 const [totalanual, setTotalanual] = useState(0);
  const { store } = useGlobalReducer();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataFact = await dashboard.getMonhtlySumary(store.token);
        if (dataFact.facturacion_mensual) {
          setFacturacionMensual(dataFact.facturacion_mensual);
        }
      } catch (error) {
        console.error("Error al cargar facturación mensual", error);
      }

      try {
        const dataGastos = await expenses.getMonthlySummary(store.token);
        console.log("gastos_mensuales", dataGastos)
        if (dataGastos.gastos_mensuales) {
          setGastosMensuales(dataGastos.gastos_mensuales);
        }
      } catch (error) {
        console.error("Error al cargar gastos mensuales", error);
      }

      try {
        const data = await apartments.getApartment(store.token);
        setTotalViviendas(data.total || 0);
      } catch (error) {
        console.error("Error al cargar total de viviendas", error);
      }

      try {
        const data = await users.getUserContractsCount(store.todos.id, store.token);
        setTotalContratos(data.total || 0);
      } catch (error) {
        console.error("Error al cargar total de contratos", error);
      }

      try {
        const data = await Issues.getIssuesOpened(store.token);
        setTotalIncidencias(data.total || 0);
      } catch (error) {
        console.error("Error al cargar total de incidencias", error);
      }
    };

    fetchData();
  }, [store.token, store.todos.id]);

  // Combinar facturación y gastos para calcular rentabilidad mensual
  useEffect(() => {
  // Obtener todos los meses (puede ser el listado de meses del año completo)
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  let acumulado = 0;
  let facturadoanual = 0
  const combinado = meses.map(mes => {
    const ingreso = facturacionMensual.find(f => f.month === mes)?.amount || 0;
    const pendiente = facturacionMensual.find(f => f.month === mes)?.pending || 0;
    const gasto = gastosMensuales.find(g => g.month === mes)?.gastos || 0;
    const rentabilidad = ingreso.toFixed(2) - gasto.toFixed(2);
    acumulado += rentabilidad;
    facturadoanual +=ingreso

    return { month: mes, ingresos: ingreso, gastos: gasto, pendientes: pendiente, rentabilidad };
  });

  setDataCombinada(combinado);
  setRentabilidadAnual(acumulado);
  setTotalanual(facturadoanual);

}, [facturacionMensual, gastosMensuales]);
console.log("facturacion", facturacionMensual)
  return (
    <div className="container-fluid mt-4">
      <div className="p-4 border rounded bg-light shadow">
        <h2 className="mb-4">🏠 Panel de control del propietario</h2>
        <p>Resumen general de tu actividad y estado de las propiedades.</p>

        {/* KPIs */}
        <div className="row text-white mt-4">
          <div className="col-md-4 mb-3">
            <div className="card bg-primary shadow text-center">
              <div className="card-body">
                <h5 className="card-title">Viviendas</h5>
                <h2>{totalViviendas}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card bg-success shadow text-center">
              <div className="card-body">
                <h5 className="card-title">Contratos Activos</h5>
                <h2>{totalContratos}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card bg-danger shadow text-center">
              <div className="card-body">
                <h5 className="card-title">Incidencias Abiertas</h5>
                <h2>{totalIncidencias}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico combinado de facturación, gastos y rentabilidad */}
        <div className="mt-5">
          <h4>📊 Rentabilidad mensual</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataCombinada}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="ingresos" fill="#4e73df" name="Ingresos">
                <LabelList dataKey="ingresos" position="top" />
              </Bar>
               <Bar dataKey="pendientes" fill="#e74a3b" name="Pendientes">
                <LabelList dataKey="ingresos" position="top" />
              </Bar>
              <Bar dataKey="gastos" fill="#e7d33bff" name="Gastos">
                <LabelList dataKey="gastos" position="top" />
              </Bar>
              <Line type="monotone" dataKey="rentabilidad" stroke="#2e59d9" name="Rentabilidad" />
            </BarChart>
          </ResponsiveContainer>
          
          <h5 className="mt-3">
            Total Acumulado Facturado : <strong>{totalanual.toFixed(2)} €</strong>
          </h5>
           <h5 className="mt-3">
            Rentabilidad anual acumulada: <strong>{rentabilidadAnual.toFixed(2)} €</strong>
          </h5>
        </div>

        {/* Accesos rápidos */}
        <div className="mt-5">
          <h5>⚡ Accesos rápidos</h5>
          <div className="d-flex gap-3 flex-wrap">
            <button className="btn btn-outline-primary" onClick={() => navigate("/add-property")}>
              ➕ Nueva Vivienda
            </button>
            <button className="btn btn-outline-success" onClick={() => navigate("/add-contract")}>
              📄 Nuevo Contrato
            </button>
            <button className="btn btn-outline-warning" onClick={() => navigate("/issues")}>
              🛠 Ver Incidencias
            </button>
            <button className="btn btn-outline-info" onClick={() => navigate("/contractors")}>
              🧰 Proveedores
            </button>
          </div>
        </div>

        {/* Últimas actividades (simulado por ahora) */}
        <div className="mt-5">
          <h5>🕓 Últimas actividades</h5>
          <ul className="list-group">
            <li className="list-group-item">📄 Contrato creado para Juan Pérez</li>
            <li className="list-group-item">🏠 Inmueble en Calle Falsa 123 añadido</li>
            <li className="list-group-item">🔧 Incidencia abierta: Fuga de agua</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PropietarioIndex;
