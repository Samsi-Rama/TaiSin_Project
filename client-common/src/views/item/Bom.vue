<template>
  <b-card title="Drum">
      <b-col cols="12">
        <b-row>
          <b-col cols="3">
            <b-button @click="add()" v-if="permission.add" variant="primary">New Mama Drum</b-button>
          </b-col>
          <b-col cols="3">
            <b-button @click="addbaby()" v-if="permission.add" variant="primary">New Baby Drum</b-button>
          </b-col>
        </b-row>
        <!-- Modal for adding new Mama Drum-->
        <b-modal style="margin:1em" v-model="addBOMModal" :title="addModal.title" :id="addModal.id" size="lg" >
          <b-form  style="margin:1em" @submit="onSubmitAdd" @reset="onReset" v-if="show">
            <b-card-actions-container class="bv-example-row">
              <b-row>
                <b-col cols="12">
                  <b-form-group>
                    <label id="add-bom-name" for="add-bom-name-input">Drum Name<span class="text-danger">*</span></label>
                    <b-form-input
                      id="add-bom-name-input"
                      v-model="addModal.form.name"
                      placeholder="Drum Name"
                      required
                    ></b-form-input>
                  </b-form-group>
                </b-col>
                <!-- <b-col cols="12">
                  <b-form-checkbox v-model="addModal.form.recipe" name="check-button" switch>
                    With Recipe<feather-icon style="color:green" v-if="addModal.form.recipe" size="1x" icon="CheckIcon"
                />
                  </b-form-checkbox>
                </b-col> -->

                <b-col cols="12">
                  <!-- Solid divider -->
                  <hr class="solid">
                </b-col>
                <b-col cols="6">
                  <h4>Cable type<span class="text-danger">*</span></h4>

                </b-col>
                <b-col cols="6">
                  <b-button size="sm" @click="addComponent(true)" variant="info" class="mr-1">
                  <b-icon icon="plus" font-scale="1"></b-icon>
                  </b-button>
                </b-col>
                <b-col cols="12">
                  <!-- Solid divider -->
                  <hr class="solid">
                </b-col>
                <b-col cols="12">
                <b-table :items="addModal.form.components" :fields="components_fields" responsive="sm" small head-variant="dark" outlined hover >
                  <template #cell(no)="row">
                    {{row.index+1}}
                  </template>
                  <template #cell(name)="row">
                    <!-- <div v-if="row.item.isNew">
                      <b-form-input
                        id="add-bom-name-input"
                        v-model="addModal.form.components[row.index].name"
                        placeholder="Component Name"
                        required
                      ></b-form-input>
                    </div> -->
                    <div>
                      <b-form-select v-model="addModal.form.components[row.index].name"
                      :options="components" text-field="name" value-field="id"></b-form-select>
                    </div>
                  </template>
                  <template #cell(quantity)="row">
                    <b-form-input
                      id="add-bom-name-input"
                      v-model="addModal.form.components[row.index].quantity"
                      placeholder="Quantity"
                      type="Number"
                      min="0"
                    ></b-form-input>
                  </template>
                  <!-- <template #cell(type)="row">
                    <b-form-checkbox
                      :id="'checkbox-add-'+row.index"
                      v-model="addModal.form.components[row.index].isNew"
                      :name="'checkbox-add-'+row.index"
                    >
                      is New
                    </b-form-checkbox>
                  </template> -->
                  <template #cell(actions)="row">
                    <b-button size="sm" @click="deleteComponent(row.index, true)" variant="danger" class="mr-1">
                    <b-icon icon="trash" font-scale="1"></b-icon>
                    </b-button>
                  </template>
                </b-table>
                </b-col>

                <b-col cols="12" style="margin-bottom: 15px">
                  <b-button type="submit" class="float-right" variant="primary" style="margin-left: 5px">Submit</b-button>
                  <b-button type="reset" class="float-right" variant="danger" style="margin-right: 7px">Reset</b-button>
                </b-col>
              </b-row>
            </b-card-actions-container>
          </b-form>
          <template #modal-footer>
            <div class="w-100">
            </div>
          </template>
        </b-modal>

        <!-- Modal for adding new Baby Drum-->

        <b-modal style="margin:1em" v-model="addBabyDrum" :title="addModalBaby.title" :id="addModalBaby.id" size="lg" >
          <b-form  style="margin:1em" @submit="babyOnSubmitAdd" @reset="onReset" v-if="show">
            <b-card-actions-container class="bv-example-row">
              <b-row>
                <b-col cols="12">
                  <b-form-group>
                    <label id="add-baby-name" for="add-baby-name-input">Drum Name<span class="text-danger">*</span></label>
                    <b-form-input
                      id="add-baby-name-input"
                      v-model="addModalBaby.form.name"
                      placeholder="Drum Name"
                      required
                    ></b-form-input>
                    <br>
                    <label id="add-baby-deskripsi" for="add-baby-deskripsi-input">Drum Deskripsi<span class="text-danger">*</span></label>
                    <b-form-textarea
                      id="add-baby-deskripsi-input"
                      v-model="addModalBaby.form.deskripsi"
                      placeholder="Drum Deskripsi"
                      rows="3"
                      max-rows="5"
                      required
                    ></b-form-textarea>
                  </b-form-group>
                </b-col>
                <b-col cols="12" style="margin-bottom: 15px">
                  <b-button type="submit" class="float-right" variant="primary" style="margin-left: 5px">Submit</b-button>
                  <b-button type="reset" class="float-right" variant="danger" style="margin-right: 7px">Reset</b-button>
                </b-col>
              </b-row>
            </b-card-actions-container>
          </b-form>
          <template #modal-footer>
            <div class="w-100">
            </div>
          </template>
        </b-modal>

        <!-- Modal for editting BOM-->
        <b-modal v-model="editBOMModal" :title="editModal.title" :id="editModal.id" size="lg">
          <b-form @submit="onSubmitEdit" @reset="onReset" v-if="show">
            <b-row>
              <b-col cols="12">
                <b-form-group>
                  <label id="edit-bom-name" for="input-2">Drum Name<span class="text-danger">*</span></label>
                  <b-form-input
                    id="input-2"
                    v-model="editModal.form.name"
                    placeholder="Drum Name"
                    required
                  ></b-form-input>
                </b-form-group>
              </b-col>
              <b-col cols="12">
                <b-form-checkbox v-model="editModal.form.recipe" name="check-button" switch>
                  With Recipe<feather-icon style="color:green" v-if="editModal.form.recipe" size="1x" icon="CheckIcon"
              />
                </b-form-checkbox>
              </b-col>
              <b-col cols="12">
                <!-- Solid divider -->
                <hr class="solid">
              </b-col>
              <b-col cols="6">
                <h4>cables<span class="text-danger">*</span></h4>
              </b-col>
              <b-col cols="6">
                <b-button size="sm" @click="addComponent(false)" variant="info" class="mr-1">
                <b-icon icon="plus" font-scale="1"></b-icon>
                </b-button>
              </b-col>
              <b-col cols="12">
                <!-- Solid divider -->
                <hr class="solid">
              </b-col>
              <b-col cols="12">
              <b-table :items="editModal.form.components" :fields="components_fields" responsive="sm" small head-variant="dark" outlined hover stacked="md">
                <template #cell(no)="row">
                  {{row.index+1}}
                </template>
                <template #cell(name)="row">
                  <div v-if="row.item.isNew">
                    <b-form-input
                      id="add-bom-name-input"
                      v-model="editModal.form.components[row.index].name"
                      placeholder="Component Name"
                      required
                    ></b-form-input>
                  </div>
                  <div v-else>
                    <b-form-select v-model="editModal.form.components[row.index].name">
                        <option :selected="true">
                          {{ editModal.form.components[row.index].name }}
                        </option>
                        <option v-for="(option, index) in components" :key="index" :value="option">
                          {{ option.name }}
                        </option>
                      </b-form-select>
                  </div>

                </template>
                <template #cell(quantity)="row">
                  <b-form-input
                    id="add-bom-name-input"
                    v-model="editModal.form.components[row.index].quantity"
                    placeholder="Quantity"
                      type="Number"
                      min="0"
                  ></b-form-input>
                </template>
                <template #cell(type)="row">
                  <b-form-checkbox
                    :id="'checkbox-edit-'+row.index"
                    v-model="editModal.form.components[row.index].isNew"
                    :name="'checkbox-edit-'+row.index"
                  >
                    is New
                  </b-form-checkbox>
                </template>
                <template #cell(actions)="row">
                  <b-button size="sm" @click="deleteComponent(row.index, false)" variant="danger" class="mr-1">
                  <b-icon icon="trash" font-scale="1"></b-icon>
                  </b-button>
                </template>
              </b-table>
              </b-col>
            </b-row>
            <div class="w-100">
              <b-button type="submit" class="float-right" variant="primary">Submit</b-button>
              <b-button type="reset" class="float-right" variant="danger" style="margin-right: 7px;">Reset</b-button>
            </div>
            </b-form>


            <template #modal-footer>
              <div class="w-100">
              </div>
            </template>
          </b-modal>

          <!-- Modal for showing BOM Details-->
          <b-modal v-model="showBOMModal" :title="detailModal.title" :id="detailModal.id" size="lg" ok-only >
            <b-row>
              <b-col cols="3">
                Name :
              </b-col>
              <b-col cols="9">
                {{detailModal.content.name}}
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
              <b-col cols="12" style="margin-top:10px" >
                <b-table :items="detailModal.content.components" :fields="components_detail_fields" responsive="sm" hover head-variant="dark" outlined small stacked= "md">
                  <template #cell(no)="row">
                    {{row.index+1}}
                  </template>
                </b-table>
              </b-col>

            </b-row>
            <template #modal-footer>
              <div class="w-100">
              </div>
            </template>
          </b-modal>
        <!-- Delete BOM modal-->
          <b-modal
          @ok="onSubmitDelete"
          v-model="deleteBOMModal"
          :title="deleteModal.title"
          :id="deleteModal.id"
          ok-only >
            <b-row>
              {{deleteModal.message}}
            </b-row>
          </b-modal>

        <!-- Download BOM modal-->
        <b-modal
          id="promptDownload"
          ref="modal"
          v-model="promptDownload"
          title="Download"
          hide-footer
        >
        <strong>Select download file type</strong>
        <div style="display: table; margin: 0 auto;">
          <download-excel :data="boms" :fields="filter" name="bom.xls" class="download-border">
            <img src="@/assets/images/xls.png" height=100>
          </download-excel>
          <download-excel :data="boms" :fields="filter" type="csv" name="bom.csv" class="download-border">
            <img src="@/assets/images/csv.png" height=100>
          </download-excel>
        </div>
      </b-modal>

      <!-- Upload BOM modal-->
        <b-modal
          id="promptUpload"
          ref="modal"
          v-model="promptUpload"
          title="Upload"
        >
          <div class="upload-border">
            <feather-icon icon="UploadIcon" size='4x'/><br>
            <b-form-file
              v-model="file"
              plain
              accept=".xls,.xlsx,.csv"
              @change="previewFiles"
              style="margin: 15px 20px;"
            ></b-form-file>
            <strong v-if="errorMessage" style="color:red; text-align:right;">{{ errorMessage }}</strong>
          </div>

          <template #modal-footer>
          <b-button
            size="md"
            variant="success"
            :disabled="errorMessage !== '' || file === null"
            @click="uploadItem"
          >
            Upload
          </b-button>
          <b-button
            size="md"
            variant="danger"
            @click="promptUpload=false"
          >
            Cancel
        </b-button>
        </template>
      </b-modal>

      <b-modal
        id="promptLoading"
        ref="modal"
        v-model="promptLoading"
        title="Processing..."
        hide-footer
      >
        <div class="progress" style="height: 30px; margin: 20px 0;">
          <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" :aria-valuenow="uploadCounter * 100 / uploadLength" aria-valuemin="0" aria-valuemax="100" :style="`width: ${uploadCounter * 100 / uploadLength}%`">
            <span class="progress-bar-title">{{ uploadCounter }} / {{ uploadLength }}</span>
          </div>
        </div>
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
                hover
                outlined
                head-variant="dark"
                :filter="search"
                :per-page="perPage"
                :current-page="currentPage"
                :items="bom"
                :fields="table_fields"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :stacked= stackedStatus
                small
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
                  :total-rows="bom.length"
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
import {mapActions} from 'vuex';
import * as XLSX from 'xlsx'
import vSelect from 'vue-select';
import Item from '../modules/item/Item.vue';

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
      search: "",
      pageOptions: [5, 10, 20, 100],
      sortBy: '',
      sortDesc: false,
      perPage: 5,
      currentPage: 1,
      //for add boms
      addBOMModal:false,
      addBabyDrum:false,
      addModal:{
        id:'add-modal-bom',
        title:'',
        form: {
          name:'',
          deskripsi:'',
          components:[{name:'',quantity:0,isNew:false}],
          createdAt:'',
          recipe:false
        }
      },

      addModalBaby:{
        id:'add-modal-baby',
        title:'',
        form: {
          name:'',
          deskripsi:'',
          createdAt:'',
        }
      },

      //for download and upload BOM
      promptDownload: false,
      promptUpload: false,
      filter: {
        'Name'      : "name",
        'Created At': 'createdAtFormatted',
        'Props'     : 'props',
      },
      file: null,
      uploadCounter: 0,
      uploadLength: 0,
      errorMessage: '',
      uploadArray: [],
      promptLoading: false,
      overwrite: false,


      //for edit boms
      editBOMModal:false,
      editModal: {
        id: 'edit-modal-bom',
        title: '',
        form: {
          name:'',
        }
      },

      show: true,

      //for show bomdetails
      showBOMModal:false,
      detailModal: {
        id: 'detail-modal-bom',
        title: '',
        content: {
          name:'',
          createdAt:'',
          updatedAt:'',
        }
      },

      //for delete Bom,
      deleteBOMModal:false,
      deleteModal: {
        id: 'delete-modal-bom',
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
      getBomData: 'bom/getItems',
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



    //method for uploading bom
    uploadItem() {
      if (this.uploadCounter === 0) {
        this.promptUpload = false;
        this.promptLoading = true;
      }
      if (this.uploadCounter < this.uploadLength) {
        setTimeout(() => {
          var data = this.uploadArray[this.uploadCounter];

          const trimmedData = Object.entries(data).reduce((acc, curr) => {
            let [key, value] = curr;
            // Checking if the key is a string
            acc[typeof key === "string" ? key.trim() : key] = value;
            return acc;
          }, {});

          this.addModal.form.name = trimmedData['Name']
          this.addModal.form.createdAt = trimmedData['Created At']
          this.addModal.form.components = JSON.parse(trimmedData['Props'])

          for(let i=0 ; i<this.addModal.form.components.length ; i++){
            this.addModal.form.components.name = this.addModal.form.components[i].name
            this.addModal.form.components.quantity = this.addModal.form.components[i].quantity
            this.addModal.form.components.isNew = this.addModal.form.components[i].isNew
          }

          this.uploadCounter++;
          this.addNewBom();
          this.uploadItem();
        }, 50)

      } else {
        this.file = null;
        this.promptLoading = false;
        this.$bvToast.toast(`Successfully Uploaded ${this.uploadLength} bom(s)`, {
          title: 'Success',
          variant: 'success',
          solid: true,
        })
      }
    },

    onRowSelected(bom) {
      this.selected = bom
    },

    previewFiles (e) {
      this.errorMessage = '';
      let files = e.target.files, f = files[0]
      const reader = new FileReader()
      reader.onload = function (e) {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, {type: 'array'})
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const XL_row_object = XLSX.utils.sheet_to_json(worksheet, {raw: false, defval: ''})

        const acceptedColumnName = [
          'Name',
          'Created At',
          'Props',
        ]

        const columnName = Object.keys(XL_row_object[0]);

        for (let i = 0; i < acceptedColumnName.length; i++) {
          if (columnName[i] !== acceptedColumnName[i]) {
            this.errorMessage = 'Invalid column name'
            return;
          }
        }

        this.uploadCounter = 0;
        this.uploadLength = XL_row_object.length;
        this.uploadArray = XL_row_object;
      }.bind(this)
      reader.readAsArrayBuffer(f)
    },

    addNewBom() {
      this.$store.dispatch("bom/addNewBOM", {...this.addModal.form,
      })
      .then(x=>{
        console.log(x)
        this.addBOMModal=false;
        this.addBabyDrum=false;
        this.addModal.form.name = '';
        // this.addModal.form.components.splice(0, this.addModal.form.components.length - 1);

        // for make sure if components truthly default/empty components.
        this.addModal.form.components = [{name:'',quantity:0,isNew:true}];

        this.$bvToast.toast("Add BOM run Successfully", {
            title: "Success",
            variant: "success",
            solid: true,
          });
        this.clearFields();
      }).catch(err=>{
        this.$bvToast.toast(err, {
            title: "Error",
            variant: "warning",
            solid: true,
          });
        this.clearFields();
      })
    },

    clearFields() {
      this.addModal.form = {
        name:'',
        components:[{name:'',quantity:0,isNew:false}],
        createdAt:'',
        recipe:false
      }
    },

    babyOnSubmitAdd(event) {
      event.preventDefault()
      this.$store.dispatch("bom/addBabyBOM",this.addModalBaby.form).
      then(x=>{
        console.log(x)
        this.addBabyDrum=false;
        this.addModalBaby.form.name = '';
        this.addModalBaby.form.deskripsi = '';

        // for make sure if components truthly default/empty components.
        this.addModal.form.components = [{name:'',deskripsi:'',quantity:0,isNew:true}];

        this.$bvToast.toast("Add BOM run Successfully", {
            title: "Success",
            variant: "success",
            solid: true,
          });
      }).catch(err=>{
        this.$bvToast.toast(err, {
            title: "Error",
            variant: "warning",
            solid: true,
          });
      })

    },

    onSubmitAdd(event) {
      event.preventDefault()
      this.$store.dispatch("bom/addBOM",this.addModal.form).
      then(x=>{
        this.addBOMModal=false;
        this.addModal.form.name = '';
        this.addModal.form.deskripsi = '';
        this.addModal.form.components.splice(0, this.addModal.form.components.length - 1);

        // for make sure if components truthly default/empty components.
        this.addModal.form.components = [{name:'',deskripsi:'',quantity:0,isNew:true}];

        this.$bvToast.toast("Add BOM run Successfully", {
            title: "Success",
            variant: "success",
            solid: true,
          });
      }).catch(err=>{
        this.$bvToast.toast(err, {
            title: "Error",
            variant: "warning",
            solid: true,
          });
      })

    },
    onSubmitEdit(event) {
      event.preventDefault();
      this.$store.dispatch("bom/editBOM",{id:this.editModal.form.id,payload:this.editModal.form}).
      then(x=>{
        this.getBomData(); // refecth data
        this.editBOMModal=false;
        this.$bvToast.toast("Edit BOM run Successfully", {
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
        this.addModal.form.components.push({name:'',quantity:0,isNew:false});
      }else{
        this.editModal.form.components.push({name:'',quantity:0,isNew:false});
      }
    },
    deleteComponent(index,isAdd){
      if(isAdd){
        this.addModal.form.components.splice(index,1);
      }else{
        this.editModal.form.components.splice(index,1);
      }

    },
    onSubmitDelete(event){
      event.preventDefault();
      this.$store.dispatch("bom/deleteBOM",this.deleteModal.content.id).
      then(x=>{
        this.deleteBOMModal=false;
        this.$bvToast.toast("delete BOM run Successfully", {
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
      this.addModal.form.components.splice(0, this.addModal.form.components.length - 1);
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
        components:item.props.components.map(x=>{
          return{
            name:x.name,
            id:x.id,
            quantity:x.quantity,
            isNew:false
          }
        })
      }
      this.showBOMModal=true;
    },
    add(){
      this.addModal.title="Add New Mama Drum"
      this.addBOMModal=true;
    },
    addbaby(){
      this.addModalBaby.title="Add New Baby Drum"
      this.addBabyDrum=true;
      console.log(this.$store.getters["bom/getBOM"])
    },
    edit(item,index,event){
      this.editModal.title="Edit "+item.name;
      this.editModal.form={
        name:item.name,
        id:item.id,
        components:item.props.components.map(x=>{
          return{
            name:x.name,
            id:x.id,
            quantity:x.quantity,
            isNew:false,
          }
        }),
        recipe: item.props.recipe,
      }
      // console.log(this.editModal.form)
      this.editBOMModal=true;
    },
    deleteOpen(item,index,event){
      console.log('delete triggered');
      this.deleteModal={
       title:"Delete BOM "+item.name,
       message:"Would you like to delete BOM "+item.name+" ?",
       content:item
      };
      this.deleteBOMModal=true;
    }
  },
  computed: {
    permission() {
      return userAccessManufacture('bom','item');
    },
    bom(){
      var filter=this.search.toString();
      console.log(filter)
      var list =this.$store.getters["bom/getBOM"].filter(x=>{
        return x.name.includes(filter)
      });
      // console.log(list)
      return list;
    },

    boms(){
      var list = this.$store.getters["bom/getBOM"] ? this.$store.getters['bom/getBOM'].map(el => {
        return {
          ...el,
          createdAtFormatted: dateFormat(el.createdAt),         
          props: '['+ el.props.components.map(x => '{"id":'+ '"'+ x.id +'"'+ ', "name":' + '"'+ x.name + '"' +  ', "quantity":' + '"' +  x.quantity +'"'+ ', "isNew":' + (x.isNew? true : false)  + '}') +']',
        }
      }) : []
      
      return list;
    },
    rows() {
      return this.bom.length;
    },
    components(){
      let data = this.$store.getters["bom/getComponents"]
      .filter(comp => comp.name.toUpperCase() !== comp.props.id);
      console.log(data)
      return data
    },
    table_fields(){
      return [{
          key: "name",
          label: "Name",
          filterable: true,
          sortable: true,
        //   stickyColumn: true,
        },
        {
          key: "createdAt",
          label: "Created At",
          filterable: true,
          sortable: true,
        //   stickyColumn: true,
        },'actions']
    },
    components_fields(){
      return ['no','name','quantity','actions']
    },
    components_detail_fields(){
      return ['no','name','quantity']
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
  created() {},
  mounted(){
    this.$store.dispatch("bom/getItems");
    this.$store.dispatch("bom/getComponents")
    // this.$store.dispatch("bom/getBOM")

    // Saving Menu Setting on localstorage session so it still same even after reloading the page
    if (this.$session.has("perPageBomManufacture")) {
      this.perPage = this.$session.get("perPageBomManufacture")
    }
    if (this.$session.has("sortByBomManufacture")) {
      this.sortBy = this.$session.get("sortByBomManufacture")
    }
    if (this.$session.has("sortDescBomManufacture")) {
      this.sortDesc = this.$session.get("sortDescBomManufacture")
    }
    // if (this.$session.has("stackedStatusBomManufacture")) {
    //   this.stackedStatus = this.$session.get("stackedStatusBomManufacture")
    // }
  },

  watch: {
    // Taking the Menu Setting from localstorage session so the setting will be the same as before
    perPage(perPageNew) {
      this.$session.set("perPageBomManufacture", perPageNew)
    },
    sortBy(sortByNew) {
      this.$session.set("sortByBomManufacture", sortByNew)
    },
    sortDesc(sortDescNew) {
      this.$session.set("sortDescBomManufacture", sortDescNew)
    },
    // stackedStatus(stackedStatusNew) {
    //   this.$session.set("stackedStatusBomManufacture", stackedStatusNew)
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