<template>
  <b-card title="Hardware">
      <b-col cols="12">
        <b-button @click="add()" v-if="permission.add" variant="primary">Add new Hardware</b-button>
        <!-- Modal for adding new Hardware-->
        <b-modal style="margin:1em" v-model="addHardwareModal" :title="addModal.title" :id="addModal.id" size="lg" >
          <b-form  style="margin:1em" @submit="onSubmitAdd" @reset="onReset" v-if="show">
            <b-card-actions-container class="bv-example-row">
              <b-row>
                <b-col cols="6">
                  <b-form-group>
                    <label id="add-hardware-name" for="add-hardware-name-input">Hardware Name<span class="text-danger">*</span></label>
                    <b-form-input
                      id="add-hardware-name-input"
                      v-model="addModal.form.name"
                      placeholder="Hardware Name"
                      required
                    ></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col cols="6">
                  <b-form-group>
                    <label id="add-hardware-brand" for="add-hardware-brand-input">Hardware Brand<span class="text-danger">*</span></label>
                    <b-form-input
                      id="add-hardware-brand-input"
                      v-model="addModal.form.props.brand"
                      placeholder="Brand"
                      required
                    ></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col cols="6">
                  <b-form-group>
                    <label id="add-hardware-model" for="add-hardware-model-input">Hardware Model<span class="text-danger">*</span></label>
                    <b-form-input
                      id="add-hardware-model-input"
                      v-model="addModal.form.props.model"
                      placeholder="Model"
                      required
                    ></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col cols="6">
                  <b-form-group>
                    <label id="add-hardware-ip" for="add-hardware-ip-input">Hardware IP<span class="text-danger">*</span></label>
                    <b-form-input
                      id="add-hardware-ip-input"
                      v-model="addModal.form.ip"
                      placeholder="Hardware IP"
                      required
                    ></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col cols="6">
                  <b-form-group>
                    <label id="add-hardware-type" for="add-hardware-type-input">Hardware Type<span class="text-danger">*</span></label>
                    <b-form-select id="add-hardware-type-input" v-model="addModal.form.type" 
                    :options="types" required></b-form-select>
                  </b-form-group>
                </b-col>
                <b-col cols="6">
                  <b-form-group>
                    <label id="add-hardware-port" for="add-hardware-port-input">Hardware Port<span class="text-danger">*</span></label>
                    <b-form-input
                      id="add-hardware-port-input"
                      v-model="addModal.form.port"
                      placeholder="Hardware Port"
                      type="number"
                      required
                    ></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col cols="6">
                  <b-form-group>
                    <label id="add-hardware-protocol" for="add-hardware-protocol-input">Hardware Protocol<span class="text-danger">*</span></label>
                    <b-form-input
                      id="add-hardware-protocol-input"
                      v-model="addModal.form.protocol"
                      placeholder="Hardware Protocol"
                      required
                    ></b-form-input>
                  </b-form-group>
                </b-col>
                
                
                <b-col cols="6" v-if="addModal.form.props.station.isAssigned">
                  <div v-if="addModal.form.props.station.isNew">
                    <b-form-input
                      id="add-station-name-input"
                      v-model="addModal.form.props.station.name"
                      placeholder="Station Name"
                      required
                    ></b-form-input>
                  </div>
                  <div v-else>
                    <b-form-select v-model="addModal.form.props.station.name" 
                    :options="stations" text-field="name" value-field="id"></b-form-select>
                  </div>   
                </b-col> 
                <b-col cols="6" v-if="addModal.form.props.station.isAssigned">
                  <b-form-checkbox
                    :id="'checkbox-is-new-station'"
                    v-model="addModal.form.props.station.isNew"
                    :name="'checkbox-is-new-station'"
                  >
                    is New
                  </b-form-checkbox> 
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

        <!-- Modal for editting Hardware-->
        <b-modal v-model="editHardwareModal" :title="editModal.title" :id="editModal.id" size="lg">      
          <b-form @submit="onSubmitEdit" @reset="onReset" v-if="show">
            <b-card-actions-container class="bv-edit-hardware">
              <b-row>
                <b-col cols="6">
                  <b-form-group>
                    <label id="edit-hardware-name" for="edit-hardware-name-input">Hardware Name<span class="text-danger">*</span></label>
                    <b-form-input
                      id="edit-hardware-name-input"
                      v-model="editModal.form.name"
                      placeholder="Hardware Name"
                      required
                    ></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col cols="6">
                  <b-form-group>
                    <label id="edit-hardware-brand" for="edit-hardware-brand-input">Hardware Brand<span class="text-danger">*</span></label>
                    <b-form-input
                      id="edit-hardware-brand-input"
                      v-model="editModal.form.props.brand"
                      placeholder="Brand"
                      required
                    ></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col cols="6">
                  <b-form-group>
                    <label id="edit-hardware-ip" for="edit-hardware-ip-input">Hardware IP<span class="text-danger">*</span></label>
                    <b-form-input
                      id="edit-hardware-ip-input"
                      v-model="editModal.form.ip"
                      placeholder="Hardware IP"
                      required
                    ></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col cols="6">
                  <b-form-group>
                    <label id="edit-hardware-type" for="edit-hardware-type-input">Hardware Type<span class="text-danger">*</span></label>
                    <b-form-select id="edit-hardware-type-input" v-model="editModal.form.type" 
                    :options="types"></b-form-select>
                  </b-form-group>
                </b-col>
                <b-col cols="6">
                  <b-form-group>
                    <label id="edit-hardware-port" for="edit-hardware-port-input">Hardware Port<span class="text-danger">*</span></label>
                    <b-form-input
                      id="edit-hardware-port-input"
                      v-model="editModal.form.port"
                      placeholder="Hardware Port"
                      type="number"
                      required
                    ></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col cols="6">
                  <b-form-group>
                    <label id="edit-hardware-protocol" for="edit-hardware-protocol-input">Hardware Protocol<span class="text-danger">*</span></label>
                    <b-form-input
                      id="edit-hardware-protocol-input"
                      v-model="editModal.form.protocol"
                      placeholder="Hardware Protocol"
                      required
                    ></b-form-input>
                  </b-form-group>
                </b-col>
                
                <b-col cols="12">
                  <!-- Solid divider -->
                  <hr class="solid">
                </b-col>               
              </b-row>
            </b-card-actions-container>
            <div class="w-100">
              <b-button type="submit" class="float-right" variant="primary">Submit</b-button>
              <b-button type="reset" class="float-right" variant="danger">Reset</b-button>    
            </div>
            </b-form>
            
              
            <template #modal-footer>
              <div class="w-100">    
              </div>
            </template>
          </b-modal>

          <!-- Modal for showing Hardware Details-->
          <b-modal v-model="showHardwareModal" :title="detailModal.title" :id="detailModal.id" size="lg" ok-only >
            <b-row>
              <b-col cols="3">
                Name :
              </b-col>
              <b-col cols="3">
                {{detailModal.content.name}}
              </b-col>
              <b-col cols="3">
                Brand :
              </b-col>
              <b-col cols="3">
                {{detailModal.content.props.brand}}
              </b-col>
              <b-col cols="3">
                Type :
              </b-col>
              <b-col cols="3">
                {{detailModal.content.type}}
              </b-col>
              <b-col cols="3">
                IP :
              </b-col>
              <b-col cols="3">
                {{detailModal.content.ip}}
              </b-col>
              <b-col cols="3">
                Port :
              </b-col>
              <b-col cols="3">
                {{detailModal.content.port}}
              </b-col>
              <b-col cols="3">
                Protocol :
              </b-col>
              <b-col cols="3">
                {{detailModal.content.protocol}}
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
            </b-row>
            <template #modal-footer>
              <div class="w-100">    
              </div>
            </template>
          </b-modal>
        <!-- Delete Hardware modal-->
          <b-modal 
          @ok="onSubmitDelete" 
          v-model="deleteHardwareModal" 
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
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
              :stacked= stackedStatus
              :current-page="currentPage" 
              :items="hardwares" 
              :fields="table_fields" 
              responsive="sm">
                
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
import { mapActions } from 'vuex';
import vSelect from 'vue-select';

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
      //for add hardware
      addHardwareModal:false,
      addModal:{
        id:'add-modal-hardware',
        title:'',
        
        form: {
          name:'',
          props:{
            station:{
              isAssigned:false,
              name:"",
              isNew:true
            }
            ,brand:'',
            model: '',
          },
          createdAt:'',
        }
      },
      


      //for edit hardware
      editHardwareModal:false,
      editModal: {
        id: 'edit-modal-hardware',
        title: '',
        form: {
          name:'',
          props:{
            brand:'',
          }
        }
      },
      
      show: true,

      //for show hardwaredetails
      showHardwareModal:false,
      detailModal: {
        id: 'detail-modal-hardware',
        title: '',
        content: {
          name:'',
          props:{},
          createdAt:'',
          updatedAt:'',
        }
      },

      //for delete Bo,
      deleteHardwareModal:false,
      deleteModal: {
        id: 'delete-modal-hardware',
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
      getHardwareData: 'plant/getHardwares',
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

    onSubmitAdd(event) {
      event.preventDefault();
      this.$store.dispatch("plant/addHardware",this.addModal.form).
      then(x=>{
        // reset add modal
        this.addModal={
        id:'add-modal-hardware',
        title:'',
        
        form: {
          name:'',
          props:{
            station:{
              isAssigned:false,
              name:"",
              isNew:true
            }
            ,brand:'',
            model: '',
          },
          createdAt:'',
        }
      },
        this.addHardwareModal=false;
        this.$bvToast.toast("Add Hardware run Successfully", {
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
    addComponent(isAdd){
      if(isAdd){
        this.addModal.form.components.push({name:'',quantity:0,isNew:true});
      }else{
        this.editModal.form.components.push({name:'',quantity:0,isNew:true});
      }
    },
    deleteComponent(index,isAdd){
      if(isAdd){
        this.addModal.form.components.splice(index,1);
      }else{
        this.editModal.form.components.splice(index,1);
      }
      
    },
    onSubmitEdit(event) {
      event.preventDefault()
      console.log(this.editModal.form)
      this.$store.dispatch("plant/editHardware",{id:this.editModal.form.id,payload:this.editModal.form}).
      then(x=>{
        this.getHardwareData();
        this.editHardwareModal=false;
        this.$bvToast.toast("Edit Hardware run Successfully", {
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
      this.$store.dispatch("plant/deleteHardware",this.deleteModal.content.id).
      then(x=>{
        this.deleteHardwareModal=false;
        this.$bvToast.toast("deleteHardware run Successfully", {
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
      this.addModal={
        id:'add-modal-hardware',
        title:'',
        
        form: {
          name:'',
          props:{
            station:{
              isAssigned:false,
              name:"",
              isNew:true
            }
            ,brand:'',
            model: '',
          },
          createdAt:'',
        }
      },
      this.editModal={
        id:'add-modal-hardware',
        title:'',
        
        form: {
          name:'',
          props:{
            station:{
              isAssigned:false,
              name:"",
              isNew:true
            }
            ,brand:'',
            model: '',
          },
          createdAt:'',
        }
      },
      this.$nextTick(() => {
        this.show = true
      })
    },
    detail(item,index,event){
      this.detailModal.title=item.name;
      this.detailModal.content={
        ...item
      }
      this.showHardwareModal=true;
    },
    add(){
      this.addModal.title="Add New Hardware"
      this.addHardwareModal=true;
    },
    edit(item,index,event){
      
      this.editModal.title="Edit "+item.name;
      this.editModal.form={
        ...item
      }
      console.log(this.editModal.form)
      this.editHardwareModal=true;
    },
    deleteOpen(item,index,event){
      console.log('delete triggered');
      this.deleteModal={
       title:"Delete Hardware "+item.name,
       message:"Would you like to delete Hardware "+item.name+" ?",
       content:item
      };
      this.deleteHardwareModal=true;
    }
  },
  computed: {
    permission() {
      return userAccessManufacture('hardware','plant');
    },
    hardwares(){
      return this.$store.getters["plant/getHardwares"];
    },
    rows() {
      return this.hardwares.length;
    },
    stations(){
      return this.$store.getters["plant/getStations"];
    },
    types(){
      return ['PLC','RFID','Weight','Sensor']
    },
    table_fields(){
      return [{
          key: "name",
          label: "Name",
          filterable: true,
          sortable: true,
        //   stickyColumn: true,
        },{
          key: "type",
          label: "Type",
          filterable: true,
          sortable: true,
        //   stickyColumn: true,
        },{
          key: "ip",
          label: "IP",
          filterable: true,
          sortable: true,
        //   stickyColumn: true,
        },{
          key: "protocol",
          label: "Protocol",
          filterable: true,
          sortable: true,
        //   stickyColumn: true,
        },{
          key: "port",
          label: "Port",
          filterable: true,
          sortable: true,
        //   stickyColumn: true,
        },{
          key: "createdAt",
          label: "Created At",
          filterable: true,
          sortable: true,
        //   stickyColumn: true,
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
    this.$store.dispatch("plant/getStations");
    //this.$store.dispatch("bom/getHardware");
    //this.$store.dispatch("bom/getComponents");
    
    // Saving Menu Setting on localstorage session so it still same even after reloading the page
    if (this.$session.has("perPageHardwareManufacture")) {
      this.perPage = this.$session.get("perPageHardwareManufacture")
    }
    if (this.$session.has("sortByHardwareManufacture")) {
      this.sortBy = this.$session.get("sortByHardwareManufacture")
    }
    if (this.$session.has("sortDescHardwareManufacture")) {
      this.sortDesc = this.$session.get("sortDescHardwareManufacture")
    }
    // if (this.$session.has("stackedStatusHardwareManufacture")) {
    //   this.stackedStatus = this.$session.get("stackedStatusHardwareManufacture")
    // }
  },

  watch: {
    // Taking the Menu Setting from localstorage session so the setting will be the same as before
    perPage(perPageNew) {
      this.$session.set("perPageHardwareManufacture", perPageNew)
    },
    sortBy(sortByNew) {
      this.$session.set("sortByHardwareManufacture", sortByNew)
    },
    sortDesc(sortDescNew) {
      this.$session.set("sortDescHardwareManufacture", sortDescNew)
    },
    // stackedStatus(stackedStatusNew) {
    //   this.$session.set("stackedStatusHardwareManufacture", stackedStatusNew)
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