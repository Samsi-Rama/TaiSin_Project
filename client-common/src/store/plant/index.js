
import axios from '@/axios.js'
import {getApp} from '../../utils/utils';
export default {
  namespaced: true,
  state: {
    hardwares:[],
    stations:[],
  },
  getters: {
    getHardwares:state=>{
      return state.hardwares;
    },
    getStations:state=>{
      return state.stations;
    },
    getProductionLines:state=>{
      var filtered=state.stations.filter(x=>{
        return x.stations.length>0
      })
      console.log('pl ',filtered)
      return filtered 
    },
    hardwareSelectOptions(state) {
      return state.hardwares.map((h) => {
        return Object.assign({}, { value: h.id, text: h.name });
      })
    },
    hardwareSelectValueOptions(state) {
      return state.hardwares.map((h) => {
        return Object.assign({}, { value: h, text: h.name });
      })
    }
  },
  mutations: {
    DELETE_HARDWARE(state,payload){
      var index = state.hardwares.findIndex(x=>{return x.id==payload});
      if(index>=0){
        state.hardwares.splice(index,1);
      }
      
    },
    DELETE_STATION(state,payload){
      var index = state.stations.findIndex(x=>{return x.id==payload});
      if(index>=0){
        state.stations.splice(index,1);
      }
      
    },
    GET_STATIONS(state,payload){
      state.stations = payload
    },
    GET_HARDWARE(state,payload) {
      state.hardwares = payload
    },
    ADD_HARDWARE(state,payload) {
      state.hardwares.push(payload)
    },
    ADD_STATION(state,payload){
      state.stations.push(payload)
    },
    EDIT_HARDWARE(state,payload){
      console.log('HARDWARE',payload)
      var editIndex = state.hardwares.findIndex(x=>{return x.id==payload.id})
      if(editIndex>=0){
        var curHardware=state.hardwares[editIndex];
        //get keys of object in payload
        var objects=Object.keys(payload);
        for(var i=0;i<objects.length;i++){
          curHardware[objects[i]]=payload[objects[i]];
        }
      }
      
    },
    EDIT_STATION(state,payload){
      var editIndex = state.stations.findIndex(x=>{return x.id==payload.id})
      if(editIndex>=0){
        var curStation=state.stations[editIndex];
        //get keys of object in payload
        var objects=Object.keys(payload);
        for(var i=0;i<objects.length;i++){
          curStation[objects[i]]=payload[objects[i]];
        }
      }
    }
  },
  actions: {
    //Used to get all item data (component or curHardware)
    getHardwares({ commit }){
      //console.log('app-name ',process.env.VUE_APP_APPLICATION_NAME)
      console.log()
      return axios
          .get('/manufacture/master-data/hardwares?props[app]='+getApp())
          .then(res => {
            commit('GET_HARDWARE',res.data.data)
          })
          .catch(err => {
            alert(err);
          });
    },
    getStations({ commit }){
      axios
          .get('/manufacture/master-data/stations?props[app]='+getApp())
          .then(res => {
            console.log(res.data.data)
            commit('GET_STATIONS',res.data.data)
          })
          .catch(err => {
            alert(err);
          });
    },
    addHardware({commit},payload){
      //Process payload, optional
      return new Promise((resolve,reject)=>{
        var data={
          name:payload.name,
          ip: payload.ip,
          type: payload.type,
          protocol: payload.protocol,
          port: payload.port,
          props:{
            app:getApp(),
            brand:payload.props.brand,
            model:payload.props.model,
          },
        }

        if(payload.props.station){
          //expected data {name:station,isNew:true/false}
          data.props.station=payload.props.station
        }
        console.log("test sebelum axios")
        axios
            .post('/manufacture/master-data/hardware/add',data)
            .then(res => {
              console.log(res.data.data)
              commit('ADD_HARDWARE',res.data.data)
              resolve('run finished')
            })
            .catch(err => {
              reject('reject')
              alert(err);
            });
      })
      
      
    },
    editHardware({commit},{id,payload}){
      //Process payload, optional
      return new Promise((resolve,reject)=>{
        var data={
          name:payload.name,
          ip: payload.ip,
          type: payload.type,
          protocol: payload.protocol,
          port: payload.port,
          props:{
            app:getApp(),
            brand:payload.props.brand
          },
        }
        if(payload.station){
          //expected data {name:station,isNew:true/false}
          data.props.station=payload.station
        }
        axios
            .put('/manufacture/master-data/hardware/'+id,data)
            .then(res => {
              console.log(res.data.data)
              commit('EDIT_HARDWARE',res.data.data)
              resolve('edit bom finish')
            })
            .catch(err => {
              reject(err);
              alert(err);
            });
      })
      
    },
    deleteHardware({commit},id){
      return new Promise((resolve,reject)=>{
        axios
          .delete('/manufacture/master-data/hardware/'+id)
          .then(res => {
            commit('DELETE_HARDWARE',id)
            resolve('delete bom finish')
          })
          .catch(err => {
            console.log(err.errors)
            reject({message:err.message,errors:err.errors});
          });
      })
    
    },
    addStation({commit},payload){
      //Process payload, optional
      return new Promise((resolve,reject)=>{
      var data={
        name:payload.name,
        hardwares:(payload.props.isProductionLine)?[]:payload.hardwares.map(x=>{
          return x.name
        }),
        stations:(payload.props.isProductionLine)?payload.stations:[],
        props:{
          app:getApp(),
          isProductionLine: (payload.props.isProductionLine) ? true : false,
        },
      }

      
      axios
          .post('/manufacture/master-data/station/add',data)
          .then(res => {
            console.log(res.data.data)
            commit('ADD_STATION',res.data.data)
            resolve('run finished')
          })
          .catch(err => {
            reject('reject')
            alert(err);
          });
      })
    },
    editStation({commit},{id,payload}){
      //Process payload, optional

      return new Promise((resolve,reject)=>{
        var data={
          name:payload.name,
          hardwares:(payload.props.isProductionLine)?[]:payload.hardwares.map(x=>{
            return x.name
          }),
          stations:(payload.props.isProductionLine)?payload.stations:[],
          props:{
            app:getApp(),
            isProductionLine: (payload.props.isProductionLine) ? true : false,
          },
        }
        
        axios
            .put('/manufacture/master-data/station/'+id,data)
            .then(res => {
              console.log(res.data.data)
              commit('EDIT_STATION',res.data.data)
              resolve('edit station finish')
            })
            .catch(err => {
              reject(err);
              alert(err);
            });
      })
      
    },
    deleteStation({commit},id){
      return new Promise((resolve,reject)=>{
        axios
          .delete('/manufacture/master-data/station/'+id)
          .then(res => {
            commit('DELETE_STATION',id)
            resolve('delete station finish')
          })
          .catch(err => {
            console.log(err.errors)
            reject({message:err.message,errors:err.errors});
          });
      })
    
    }
  }
}
