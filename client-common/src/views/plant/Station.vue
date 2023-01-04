<template>
  <b-card title="Station">
      <b-col cols="12">
        <b-button @click="add()" v-if="permission.add" variant="primary">Add new Station</b-button>
        <!-- Modal for adding new Station-->
        <b-modal style="margin:1em" v-model="addStationModal" :title="addModal.title" :id="addModal.id" size="lg" >
          <b-form  style="margin:1em" @submit="onSubmitAdd" @reset="onReset" v-if="show">
            <b-card-actions-container class="bv-example-row">
              <b-row>
                <b-col cols="6">
                  <b-form-group>
                    <label id="add-station-name" for="add-station-name-input">Station name<span class="text-danger">*</span></label>
                    <b-form-input
                      id="add-station-name-input"
                      v-model="addModal.form.name"
                      placeholder="Station Name"
                      required
                    ></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col cols="6">
                  <b-button size="sm" v-if="addIsProductionLine"
                    @click="addStation(true)" variant="info" class="mr-1">
                    <b-icon icon="plus" font-scale="1"></b-icon>
                  </b-button>
                  <b-button size="sm" v-else
                    @click="addHardware(true)" variant="info" class="mr-1">
                    <b-icon icon="plus" font-scale="1"></b-icon>
                  </b-button>     
                </b-col>
                <b-col cols="12">
                  <!-- Solid divider -->
                  <hr class="solid">
                </b-col>     
                <b-col cols="12">
                  <!-- Station is Production line -->
                  <b-table v-if="addIsProductionLine" 
                    :items="addModal.form.stations" :fields="station_list_fields" responsive="sm" small head-variant="dark" outlined hover>
                    <template #cell(name)="row">
                      <div v-if="row.item.isNew">
                        <b-form-input
                          id="add-station-name-input"
                          v-model="addModal.form.stations[row.index].name"
                          placeholder="Station Name"
                          required
                        ></b-form-input>
                      </div>
                      <div v-else>
                        <b-form-select required v-model="addModal.form.stations[row.index].name" 
                        :options="stations" text-field="name" value-field="id"></b-form-select>
                      </div>
                    </template>
                    <template #cell(type)="row">
                      <b-form-checkbox
                        :id="'checkbox-add-'+row.index"
                        v-model="addModal.form.stations[row.index].isNew"
                        :name="'checkbox-add-'+row.index"
                      >
                        is New
                      </b-form-checkbox>
                    </template>
                    <template #cell(actions)="row">
                      <b-button size="sm" @click="deleteStation(row.index, true)" variant="danger" class="mr-1">
                      <b-icon icon="trash" font-scale="1"></b-icon>
                      </b-button>
                    </template>
                  </b-table>
                  <b-table v-else 
                    :items="addModal.form.hardwares" :fields="hardware_list_fields" responsive="sm" small head-variant="dark" outlined hover>
                    <template #cell(name)="row">
                        <b-form-select required v-model="addModal.form.hardwares[row.index].name" 
                        :options="hardwares" text-field="name" value-field="id"></b-form-select>
                    </template>
                    <template #cell(actions)="row">
                      <b-button size="sm" @click="deleteHardware(row.index, true)" variant="danger" class="mr-1">
                      <b-icon icon="trash" font-scale="1"></b-icon>
                      </b-button>
                    </template>
                  </b-table>
                </b-col>           
                <b-col cols="12" style="margin-bottom: 15px">
                  <b-button type="submit" class="float-right" variant="primary" style="margin-left: 5px">Submit</b-button>
                  <b-button type="reset" class="float-right" variant="danger" style="margin-right: 5px">Reset</b-button>    
                </b-col>
              </b-row>
            </b-card-actions-container>
          </b-form>
          <template #modal-footer>
            <div class="w-100">    
            </div>
          </template>
        </b-modal>

        <!-- Modal for editting Station-->
        <b-modal v-model="editStationModal" :title="editModal.title" :id="editModal.id" size="lg">      
          <b-form @submit="onSubmitEdit" @reset="onReset" v-if="show">
            <b-card-actions-container class="bv-example-row">
              <b-row>
                <b-col cols="6">
                  <b-form-group>
                  <label id="edit-station-name" for="edit-station-name-input">Station name<span class="text-danger">*</span></label>
                    <b-form-input
                      id="edit-station-name-input"
                      v-model="editModal.form.name"
                      placeholder="Station Name"
                      required
                    ></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col cols="6">
                  <b-form-checkbox
                    :id="'checkbox-is-pl-station'"
                    v-model="editIsProductionLine"
                    :name="'checkbox-is-pl-station'"
                  >
                    is Production Line
                  </b-form-checkbox>
                </b-col>
                <b-col cols="6">
                  <h4>{{(editIsProductionLine)?'Stations':'Hardwares'}}<span class="text-danger">*</span></h4>  
                </b-col>
                <b-col cols="6">
                  <b-button size="sm" v-if="editIsProductionLine"
                    @click="addStation(false)" variant="info" class="mr-1">
                    <b-icon icon="plus" font-scale="1"></b-icon>
                  </b-button>
                  <b-button size="sm" v-else
                    @click="addHardware(false)" variant="info" class="mr-1">
                    <b-icon icon="plus" font-scale="1"></b-icon>
                  </b-button>     
                </b-col>
                <b-col cols="12">
                  <!-- Solid divider -->
                  <hr class="solid">
                </b-col>     
                <b-col cols="12">
                  <!-- Station is Production line -->
                  <b-table v-if="editIsProductionLine" 
                    :items="editModal.form.stations" :fields="station_list_fields" responsive="sm" small head-variant="dark" outlined hover>
                    <template #cell(name)="row">
                      <div v-if="row.item.isNew">
                        <b-form-input
                          id="edit-station-name-input"
                          v-model="editModal.form.stations[row.index].name"
                          placeholder="Station Name"
                          required
                        ></b-form-input>
                      </div>
                      <div v-else>
                      <!-- <b-form-select v-model="editModal.form.stations[row.index].name" 
                        :options="stations" text-field="name" value-field="id">
                      </b-form-select> -->
                      <b-form-select required
                        v-model="editModal.form.stations[row.index].name">
                        <option v-if="editModal.form.stations[row.index].stationName" :value="editModal.form.stations[row.index].id" :selected="true">{{editModal.form.stations[row.index].stationName}}</option>
                        <option v-for="station in stations" :value="station.id">
                          {{station.name}}
                        </option>
                      </b-form-select>
                      </div>
                    </template>
                    <template #cell(type)="row">
                      <b-form-checkbox
                        :id="'checkbox-edit-'+row.index"
                        v-model="editModal.form.stations[row.index].isNew"
                        :name="'checkbox-edit-'+row.index"
                      >
                        is New
                      </b-form-checkbox>
                    </template>
                    <template #cell(actions)="row">
                      <b-button size="sm" @click="deleteStation(row.index, false)" variant="danger" class="mr-1">
                      <b-icon icon="trash" font-scale="1"></b-icon>
                      </b-button>
                    </template>
                  </b-table>
                  <b-table v-else 
                    :items="editModal.form.hardwares" :fields="hardware_list_fields" responsive="sm" small head-variant="dark" outlined hover>
                    <template #cell(name)="row">
                        <b-form-select required v-model="editModal.form.hardwares[row.index].name" 
                        :options="hardwares" text-field="name" value-field="id"></b-form-select>
                    </template>
                    <template #cell(actions)="row">
                      <b-button size="sm" @click="deleteHardware(row.index, false)" variant="danger" class="mr-1">
                      <b-icon icon="trash" font-scale="1"></b-icon>
                      </b-button>
                    </template>
                  </b-table>
                </b-col>           
                <b-col cols="12">
                  <b-button type="submit" class="float-right" variant="primary">Submit</b-button>
                  <b-button type="reset" class="float-right" variant="danger">Reset</b-button>    
                </b-col>
              </b-row>
            </b-card-actions-container>
            </b-form>
            
              
            <template #modal-footer>
              <div class="w-100">    
              </div>
            </template>
          </b-modal>

          <!-- Modal for showing Station Details-->
          <b-modal v-model="showStationModal" :title="detailModal.title" :id="detailModal.id" size="lg" ok-only >
            <b-row>
              <b-col cols="3">
                Name :
              </b-col>
              <b-col cols="3">
                {{detailModal.content.name}}
              </b-col>
              <b-col cols="3">
                Type :
              </b-col>
              <b-col cols="3">
                {{(detailModal.content.props.isProductionLine)?'Production Line':'Station'}}
              </b-col>
              <b-col cols="3">
                Created At:
              </b-col>
              <b-col cols="9">
                {{detailModal.content.createdAt}}
              </b-col>
              <b-col cols="3">
                Updated At :
              </b-col>
              <b-col cols="9">
                {{detailModal.content.updatedAt}}
              </b-col>
              <b-col cols="12">
                <b-table v-if="detailModal.content.props.isProductionLine" 
                    :items="detailModal.content.stations" :fields="station_list_fields" responsive="sm" small head-variant="dark" outlined hover>
                    <template #cell(name)="row">
                      {{row.item.name}}
                    </template>
                    <template #cell(type)="row">
                      {{(detailModal.content.props.isProductionLine)?'Production Line':'Station'}}
                    </template>
                  </b-table>
                  <b-table v-else 
                    :items="detailModal.content.hardwares" :fields="hardware_list_fields_detail" responsive="sm" small head-variant="dark" outlined hover>
                    <template #cell(name)="row">
                      {{row.item.name}}
                    </template>
                  </b-table>
              </b-col>
            </b-row>

            <template #modal-footer>
              <div class="w-100">    
              </div>
            </template>
          </b-modal>
        <!-- Delete Station modal-->
          <b-modal 
          @ok="onSubmitDelete" 
          v-model="deleteStationModal" 
          :title="deleteModal.title" 
          :id="deleteModal.id" 
          ok-only >
            <b-row>
              {{deleteModal.message}}
            </b-row>
          </b-modal>
      </b-col>
      <b-col cols="12">
        <!-- Solid divider -->
        <hr class="solid">
      </b-col>
      <b-col>
        <b-row class="show-on-mobile">
          <b-col cols="6" style="margin-bottom:15px;">
              <b-form-group
              label="Sort By"
              label-for="sort-by-select"
              label-cols-md="0"
              label-align-sm="left"
              label-size="md"
              class="mb-0"
              >
              <b-input-group size="sm">
                  <b-form-select
                  id="sort-by-select"
                  v-model="sortBy"
                  :options="sortOptions"
                  class="w-75"
                  >
                  <template #first>
                      <option value="">-- none --</option>
                  </template>
                  </b-form-select>

                  <b-form-select
                  v-model="sortDesc"
                  :disabled="!sortBy"
                  :options="directionOptions"
                  size="sm"
                  class="w-25"
                  >
                  </b-form-select>
              </b-input-group>
              </b-form-group>
          </b-col>
        </b-row>
      </b-col>

      <b-col cols="12">
        <b-row style="margin-bottom:15px;">
          <b-col cols="4" />
          <b-col cols="4" />
          <b-col cols="4">
            <div>
            <b-row>
              <span class="spin" v-if="showSpinner"></span>
            </b-row>
            <!-- Search Box -->
            <b-form-input
              v-model="search"
              @input="debounceSearch"
              type="search"
              placeholder="Type to Search"
              style="float: right;"
            />
            </div>
          </b-col>
        </b-row>
        <b-row style="margin-bottom:10px" class="show-on-mobile">
          <b-col>
            <b-form-checkbox
              v-model="stackedStatus"
              value="md"
              unchecked-value= false
            >
              Stacked Table
            </b-form-checkbox>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="12">
            <div style="overflow-x: visible;">
              <b-table 
              :filter="search"
              hover
              outlined
              head-variant="dark"
              small
              :per-page="perPage"
              :current-page="currentPage" 
              :items="stations" 
              :fields="table_fields"
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc" 
              :stacked= stackedStatus
              responsive="sm">
                <!--
                <template #cell(type)="row">
                  {{(row.item.stations.length>0)?'PL':'Station'}}
                </template>
                -->
                <template v-slot:cell(actions)="row">
                  <b-dropdown variant="success" size="sm" text="Menu" no-caret>
                    <template #button-content>
                      <feather-icon size="1x" icon="MenuIcon" />
                    </template>
                    <b-dropdown-item>
                      <b-button variant="success" size="sm" @click="detail(row.item, row.index, $event.target)" style="margin-right:10px"><feather-icon size="1x" icon="EyeIcon" /></b-button>
                    </b-dropdown-item>
                    <b-dropdown-item v-if="permission.edit">
                      <b-button variant="primary" size="sm" style="margin-right:10px" @click="edit(row.item, row.index, $event.target)"><feather-icon size="1x" icon="EditIcon" /> </b-button>
                    </b-dropdown-item>
                    <b-dropdown-item v-if="permission.delete">
                      <b-button variant="danger" size="sm" style="margin-right:10px" @click="deleteOpen(row.item, row.index, $event.target)" ><feather-icon size="1x" icon="Trash2Icon" /></b-button>
                    </b-dropdown-item>
                  </b-dropdown>
                </template>
              </b-table>
            </div>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="4" class="pt-1">
            <b-form-group
              label="Data Per Page"
              label-for="per-page-select"
              label-cols-md="0"
              label-align-sm="left"
              label-size="md"
              class="mb-0"
            >
              <b-form-select
                  id="per-page-select"
                  v-model="perPage"
                  :options="pageOptions"
                  size="sm"
              ></b-form-select>
            </b-form-group>
          </b-col>
          <b-col class="pt-1">
              <b-pagination
                  v-model="currentPage"
                  :total-rows="rows"
                  :per-page="perPage"
                  first-number
                  last-number
                  class="float-right"
                  aria-controls="user-table"
              ></b-pagination>
          </b-col>
        </b-row> 
      </b-col>
  </b-card>
</template>

<script>
import { dateFormat, userAccess, userAccessManufacture, viewAccess } from '@/utils/utils.js';

import vSelect from 'vue-select';
import { mapActions } from 'vuex';

export default {
  components: {
    vSelect
  },
  data() {
    return {
      stackedStatus:"md",
      showSpinner: false,
      //sort direction list
      directions: [
          { key: false, label: 'Asc', sortable: true },
          { key: true, label: 'Desc', sortable: true },
      ],
      search: null,
      pageOptions: [5, 10, 20, 100],
      sortBy: '',
      sortDesc: false,
      perPage: 5,
      currentPage: 1,
      //for add station
      addStationModal:false,
      addModal:{
        id:'add-modal-station',
        title:'',
        form: {
          name:'',
          hardwares:[{name: ''}],
          stations:[],
          props:{
            isProductionLine:false
          },
          createdAt:'',
        }
      },
      


      //for edit station
      editStationModal:false,
      editModal: {
        id: 'edit-modal-station',
        title: '',
        form: {
          name:'',
          hardwares:[{name: ''}],
          stations:[],
          props:{
            isProductionLine:false
          },
        }
      },
      
      show: true,

      //for show stationdetails
      showStationModal:false,
      detailModal: {
        id: 'detail-modal-station',
        title: '',
        content: {
          name:'',
          props:{
            isProductionLine:false
          },
          createdAt:'',
          updatedAt:'',
        }
      },

      //for delete Bo,
      deleteStationModal:false,
      deleteModal: {
        id: 'delete-modal-station',
        title: ' ',
        message:' ',
        content: {
          id:'',
          name:''
        }
      }
    }
  },
  methods: {
    ...mapActions({
      hardwaresData: 'plant/getHardwares',
      stationsData: 'plant/getStations',
    }),
    // add spinner while loading on searching data process
    debounceSearch(event) {
        this.showSpinner = true
        clearTimeout(this.debounce)
        this.debounce = setTimeout(() => {
            this.showSpinner = false
            this.search = event.target.value
        }, 600)
    },

    filterFunction(){
      
    },
    onSubmitAdd(event) {
      event.preventDefault()
      this.$store.dispatch("plant/addStation",this.addModal.form).
      then(x=>{
        this.stationsData();
        this.hardwaresData();
        this.addStationModal=false;
        this.$bvToast.toast("Add Station run Successfully", {
            title: "Success",
            variant: "success",
            solid: true,
          });
        this.addModal.form.name = '';
        this.addModal.form.hardwares.splice(0,1);

      }).
      catch(err=>{
        this.$bvToast.toast(err, {
            title: "Error",
            variant: "warning",
            solid: true,
          });
      })
      
    },
    addHardware(isAdd){
      if(isAdd){
        this.addModal.form.hardwares.push({name:'',isNew:false});
        console.log(this.addModal.form)
      }else{
        this.editModal.form.hardwares.push({name:'',isNew:false});
      }
    },
    deleteHardware(index,isAdd){
      if(isAdd){
        this.addModal.form.hardwares.splice(index,1);
      }else{
        this.editModal.form.hardwares.splice(index,1);
      }
      
    },
    addStation(isAdd){
      if(isAdd){
        this.addModal.form.stations.push({name:'',isNew:false});
      }else{
        this.editModal.form.stations.push({name:'',isNew:false});
      }
    },
    deleteStation(index,isAdd){
      if(isAdd){
        this.addModal.form.stations.splice(index,1);
      }else{
        this.editModal.form.stations.splice(index,1);
      }
      
    },
    onSubmitEdit(event) {
      event.preventDefault()
      this.$store.dispatch("plant/editStation",{id:this.editModal.form.id,payload:this.editModal.form}).
      then(x=>{
        this.stationsData();
        this.hardwaresData();
        this.editStationModal=false;
        this.$bvToast.toast("Edit Station run Successfully", {
            title: "Success",
            variant: "success",
            solid: true,
          });
      }).
      catch(err=>{
        this.$bvToast.toast(err, {
            title: "Error",
            variant: "warning",
            solid: true,
          });
      })
    },
    onSubmitDelete(event){
      event.preventDefault();
      this.$store.dispatch("plant/deleteStation",this.deleteModal.content.id).
      then(x=>{
        this.deleteStationModal=false;
        this.$bvToast.toast("deleteStation run Successfully", {
            title: "Success",
            variant: "success",
            solid: true,
          });
      }).
      catch(err=>{
        console.log(err.message);
        this.$bvToast.toast(err, {
            title: "Error",
            variant: "warning",
            solid: true,
          });
      })
    },
    onReset(event) {
      event.preventDefault()
      // Reset our form values
      this.addModal.form={
        name:'',
          hardwares:[],
          stations:[],
          props:{
            isProductionLine:false
          },
          createdAt:'',
      }
      this.editModal.form={
        name:'',
          hardwares:[],
          stations:[],
          props:{
            isProductionLine:false
          },
          createdAt:'',
      }
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    },
    detail(item,index,event){
      this.detailModal.title=item.name;
      this.detailModal.content={
        createdAt:item.createdAt,
        updatedAt:item.updatedAt,
        name:item.name,
        id:item.id,
        hardwares:item.hardwares,
        stations:item.stations,
        props:{
          isProductionLine:(item.hardwares.length>0)?false:true
        }
      }
      this.showStationModal=true;
    },
    add(){
      this.addModal={
        id:'add-modal-station',
        title:'Add New Station',
        form: {
          name:'',
          hardwares:[{name: ''}],
          stations:[],
          props:{
            isProductionLine:false
          },
          createdAt:'',
        }
      },
      this.addStationModal=true;
    },
    edit(item,index,event){
      this.editModal.title="Edit "+item.name;
      this.editModal.form={
        name:item.name,
        id:item.id,
        hardwares:item.hardwares.map(x=>{
          return {name:x.id}
        }),
        stations:item.stations.map(x=>{
          return {
            name:x.id,
            stationName: x.name,
            isNew:false
          }
        }),
        props: item.props
      }

      console.log(this.editModal.form)
      this.editStationModal=true;
    },
    deleteOpen(item,index,event){
      console.log('delete triggered');
      this.deleteModal={
       title:"Delete Station "+item.name,
       message:"Would you like to delete Station "+item.name+" ?",
       content:item
      };
      this.deleteStationModal=true;
    }
  },
  computed: {
    addIsProductionLine: {
      set(val) {
        if (val === true) {
          this.addModal.form.stations = [{name: '', isNew: false}];
        }else {
          this.addModal.form.hardwares = [{name: ''}];
        }
        this.addModal.form.props.isProductionLine = val;
      },
      get(){
        return this.addModal.form.props.isProductionLine;
      }
    },
    editIsProductionLine: {
      set(val) {
        if (val === true) {
          this.editModal.form.stations = [{name: '', isNew: false}];
        }else {
          this.editModal.form.hardwares = [{name: ''}];
        }
        this.editModal.form.props.isProductionLine = val;
      },
      get(){
        return this.editModal.form.props.isProductionLine;
      }
    },
    permission() {
      return userAccessManufacture('station','plant');
    },
    hardwares(){
      return this.$store.getters["plant/getHardwares"];
    },
    stations(){
      return this.$store.getters["plant/getStations"];
    },
    rows() {
      return this.stations.length;
    },
    types(){
      return ['PLC','RFID','Weight','Sensor']
    },
    station_list_fields(){
      return ['name','type',]
    },
    hardware_list_fields(){
      return ['name', 'actions']
    },
    hardware_list_fields_detail(){
      return ['name', 'type']
    },
    table_fields(){
      return [{
          key: "name",
          label: "Name",
          filterable: true,
          sortable: true,
          formatter:(value,key,item)=>{
            return item.name
          },
          //sortByFormatted: (value, key, item) => {
          //    return item.name
          //}
        //   stickyColumn: true,
        },{
          key: "type",
          label: "Type",
          filterable: true,
          sortable: true,
          formatter: (value, key, item) => {
              return  item.stations.length>0 ? 'PL' : 'Station'
          },
          sortByFormatted: true,
          filterByFormatted:true,
        //   stickyColumn: true,
        },{key: "createdAt",
          label: "Timestamp",
          filterable: true,
          sortable: true,
          formatter: (value, key, item) => {
              return  new Date(item.createdAt)
          },
          sortByFormatted:true,
          },'actions']
    },
    // Create an options list from our fields
    sortOptions() {
      return this.table_fields
        .filter(f => f.sortable)
        .map(f => {
        return { text: f.label, value: f.key }
        })
    },
    // Create an direction list that can be saved in session
    directionOptions() {
    return this.directions
        .filter(f => f.sortable)
        .map(f => {
        return { text: f.label, value: f.key }
        })
    },
  },
  created() {
  },
  mounted(){
    this.$store.dispatch("plant/getHardwares");
    this.$store.dispatch("plant/getStations")
    //this.$store.dispatch("bom/getHardware");
    //this.$store.dispatch("bom/getComponents");

    // Saving Menu Setting on localstorage session so it still same even after reloading the page
    if (this.$session.has("perPageStationManufacture")) {
      this.perPage = this.$session.get("perPageStationManufacture")
    }
    if (this.$session.has("sortByStationManufacture")) {
      this.sortBy = this.$session.get("sortByStationManufacture")
    }
    if (this.$session.has("sortDescStationManufacture")) {
      this.sortDesc = this.$session.get("sortDescStationManufacture")
    }
    // if (this.$session.has("stackedStatusStationManufacture")) {
    //   this.stackedStatus = this.$session.get("stackedStatusStationManufacture")
    // }
  },
  watch: {
    // Taking the Menu Setting from localstorage session so the setting will be the same as before
    perPage(perPageNew) {
      this.$session.set("perPageStationManufacture", perPageNew)
    },
    sortBy(sortByNew) {
      this.$session.set("sortByStationManufacture", sortByNew)
    },
    sortDesc(sortDescNew) {
      this.$session.set("sortDescStationManufacture", sortDescNew)
    },
    // stackedStatus(stackedStatusNew) {
    //   this.$session.set("stackedStatusStationManufacture", stackedStatusNew)
    // }
  },
}
</script>

<style>
  @media (min-width: 761px) {
    .show-on-mobile { display: none !important; }
  }
  @keyframes spinner {
    0% {
    transform: translate3d(-50%, -50%, 0) rotate(0deg);
    }
    100% {
    transform: translate3d(-50%, -50%, 0) rotate(360deg);
    }
  }
  .spin::before {
    animation: 1.5s linear infinite spinner;
    animation-play-state: inherit;
    border: solid 5px #cfd0d1;
    border-bottom-color: #0077B3;
    border-radius: 50%;
    content: "";
    height: 20px;
    width: 20px;
    position: absolute;
    margin-top: 20px;
    transform: translate3d(-50%, -50%, 0);
    will-change: transform;
  }
</style>