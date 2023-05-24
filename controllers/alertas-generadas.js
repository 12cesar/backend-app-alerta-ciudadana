const { request, response } = require('express');
const {
  subirArchivo,
  addHoursToDate,
  fechaAntes,
  funDate,
} = require('../helpers');
const { AlertaGenerada, Alerta } = require('../models');
const sequelize = require('../database/database');
const { Op } = require('sequelize');

const getAlertasGeneradas = async (req = request, res = response) => {
  try {
    res.json({
      ok: true,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: `Error: ${error}`,
    });
  }
};
const getAlertasGenerada = async (req = request, res = response) => {
  try {
    res.json({
      ok: true,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: `Error: ${error}`,
    });
  }
};
const filtroAlertaGenerada = async (req = request, res = response) => {
  try {
    const { tipo } = req.query;
    const { fechaUno, fechaDos, tipoAlerta } = req.body;
    const fechaAnter = addHoursToDate(new Date(), 24);
    const { fecha } = funDate();
    let consulta = '';
    switch (tipo) {
      case '1':
        consulta = `
                  select R.id, R.descripcion, R.fecha, R.hora, A.lat,A.lng, T.nombre as tipo_alerta, T.img, T.color, C.nombre, C.apellido
                  from alerta_generada R inner join alertas A on R.id_alerta = A.id inner join tipo_alertas T on R.id_tipo_alerta= T.id inner join ciudadano C on A.ciudadano = C.id 
                  order by R.fecha, R.hora desc
                  `;
        break;
      case '2':
        consulta = `
                  select R.id, R.descripcion, R.fecha, R.hora, A.lat,A.lng, T.nombre as tipo_alerta, T.img, T.color, C.nombre, C.apellido
                  from alerta_generada R inner join alertas A on R.id_alerta = A.id inner join tipo_alertas T on R.id_tipo_alerta= T.id inner join ciudadano C on A.ciudadano = C.id 
                  where R.fecha>='${fechaUno}' AND R.fecha<='${fechaDos}' order by R.fecha, R.hora desc
                  `;
        break;
      case '3':
        consulta = `
                  select R.id, R.descripcion, R.fecha, R.hora, A.lat,A.lng, T.nombre as tipo_alerta, T.img, T.color, C.nombre, C.apellido
                  from alerta_generada R inner join alertas A on R.id_alerta = A.id inner join tipo_alertas T on R.id_tipo_alerta= T.id inner join ciudadano C on A.ciudadano = C.id 
                  where R.id_tipo_alerta='${tipoAlerta}  order by R.fecha, R.hora desc'
                  `;
        break;
      case '4':
        consulta = `
                  select R.id, R.descripcion, R.fecha, R.hora, A.lat,A.lng, T.nombre as tipo_alerta, T.img, T.color, C.nombre, C.apellido
                  from alerta_generada R inner join alertas A on R.id_alerta = A.id inner join tipo_alertas T on R.id_tipo_alerta= T.id inner join ciudadano C on A.ciudadano = C.id 
                  where R.fecha>='${fechaAnter}' AND R.fecha<='${fecha}' order by R.fecha, R.hora desc
                  `;
        break;
      default:
        consulta = 'select* from alerta_generada';
        break;
    }
    const [results, metadata] = await sequelize.query(consulta);
    res.json({
      ok: true,
      msg: 'Se muestran las alertas con exito',
      results,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: `Error: ${error}`,
    });
  }
};
const postAlertasGenerada = async (req = request, res = response) => {
  try {
    const { id_alerta, ...data } = req.body;
    const { fecha, hora, ano, mes } = funDate();
    data.fecha = fecha;
    data.hora = hora;
    data.id_alerta = id_alerta;
    data.ano = ano;
    data.mes = mes;
    const resp = await AlertaGenerada.create(data);
    const alerta = await Alerta.update(
      { registrado: 1 },
      { where: { id: id_alerta } }
    );
    res.json({
      ok: true,
      msg: 'Alerta Registrada con exito',
      alerta: resp,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: `Error: ${error}`,
    });
  }
};
const putAlertasGenerada = async (req = request, res = response) => {
  try {
    res.json({
      ok: true,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: `Error: ${error}`,
    });
  }
};
const deleteAlertasGenerada = async (req = request, res = response) => {
  try {
    res.json({
      ok: true,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: `Error: ${error}`,
    });
  }
};

module.exports = {
  getAlertasGeneradas,
  getAlertasGenerada,
  filtroAlertaGenerada,
  postAlertasGenerada,
  putAlertasGenerada,
  deleteAlertasGenerada,
};
