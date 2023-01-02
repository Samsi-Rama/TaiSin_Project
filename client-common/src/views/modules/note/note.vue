<template>
  <div>
    <b-breadcrumb>
      <b-breadcrumb-item :to="`/${home}`">
        <b-icon icon="house-fill" scale="1.25" shift-v="1.25" aria-hidden="true"></b-icon>
      </b-breadcrumb-item>
      <b-breadcrumb-item active>Note</b-breadcrumb-item>
    </b-breadcrumb><br>

    <b-card title="Note">
      <b-modal
        id="promptAddEdit"
        ref="modal"
        v-model="promptAddEdit"
        :title="title"
      >
        <b-form-group
          label="Subject"
          label-for="form-subject"
        >
          <b-form-input
            id="form-subject"
            v-model="form.subject"
          />
        </b-form-group>

        <!-- <b-form-group
          label="Creator"
          label-for="form-creator"
        >
          <b-form-input
            id="form-creator"
            v-model="form.creator"
            
          />
        </b-form-group> -->

        <!-- <b-form-group
          label="Receiver"
          label-for="form-receiver"
        >
          <b-form-input
            id="form-receiver"
            v-model="form.receiver"
          />
        </b-form-group> -->

        <b-form-group
          label="Receiver"
          label-for="form-receiver"
        >
          <v-select
            v-model="form.receiver"
            placeholder="----- Select Receiver -----"
            :options="receiver"
            label="email"
            :clearable="false" />
        </b-form-group>

        <b-form-group
          label="Content"
          label-for="form-content"
        >
          <b-form-textarea
            id="form-content"
            v-model="form.content"
            placeholder="Enter something..."
            rows="4"
            max-rows="6"
          />
        </b-form-group>

        <template #modal-footer>
          <b-button
            size="md"
            variant="success"
            @click=save
          >
            Save
          </b-button>
          <b-button
            size="md"
            variant="danger"
            @click="promptAddEdit=false"
          >
            Cancel
          </b-button>
        </template>
      </b-modal>

      <b-modal
        id="promptDelete"
        ref="modal"
        v-model="promptDelete"
        title="Delete Note"
      >
        <p
          class="my-2"
        >
          Are you sure that you want to permanently delete selected Note?
        </p>
        <template #modal-footer>
          <b-button
            size="md"
            variant="success"
            @click="confirmDelete"
          >
            Delete
          </b-button>
          <b-button
            size="md"
            variant="danger"
            @click="promptDelete=false"
          >
            Cancel
          </b-button>
        </template>
      </b-modal>

      <b-modal
        id="promptDeleteSelected"
        ref="modal"
        v-model="promptDeleteSelected"
        title="Delete Selected"
      >
        <p
          class="my-2"
        >
          Are you sure that you want to permanently delete selected notes?
        </p>
        <template #modal-footer>
          <b-button
            size="md"
            variant="success"
            @click="deleteMultiple"
          >
            Delete
          </b-button>
          <b-button
            size="md"
            variant="danger"
            @click="promptDeleteSelected=false"
          >
            Cancel
          </b-button>
        </template>
      </b-modal>

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
          <b-col cols="4">
            <b-button
              variant="primary"
              v-if="permission.add"
              @click="addNote"
            >
              Add Note
            </b-button>
            <b-button
              variant="danger"
              style="margin-left:15px;"
              v-if="permission.delete && selected.length > 0"
              @click="promptDeleteSelected=true"
            >
              Delete Selected
            </b-button>
          </b-col>
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
                id="note-table"
                responsive
                :items="notes"
                :per-page="perPage"
                :current-page="currentPage"
                :fields="fields"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :filter="search"
                select-mode="multi"
                head-variant="dark"
                selectable
                hover
                small
                outlined
                :stacked= stackedStatus
                @row-selected="onRowSelected"
              >
                <template #cell(selected)="{ rowSelected }">
                  <template v-if="rowSelected">
                    <span aria-hidden="true">&check;</span>
                    <span class="sr-only">Selected</span>
                  </template>
                  <template v-else>
                    <span aria-hidden="true">&nbsp;</span>
                    <span class="sr-only">Not selected</span>
                  </template>
                </template>

                <template v-slot:cell(actions)="row">
                  <div>
                    <b-dropdown variant="success" size="sm" text="Menu" no-caret>
                      <template #button-content>
                        <feather-icon size="1x" icon="MenuIcon" />
                      </template>
                      <b-dropdown-item v-if="permission.edit">
                        <b-button variant="success" size="sm" style="margin-left:15px;" @click="editNote(row.item.id)">
                          <feather-icon size="1x" icon="EditIcon" />
                        </b-button>
                      </b-dropdown-item>
                      <b-dropdown-item v-if="permission.delete">
                        <b-button variant="danger" size="sm" style="margin-left:15px;" type="filled" @click="deleteNote(row.item.id)">
                          <feather-icon size="1x" icon="Trash2Icon" />
                        </b-button>
                      </b-dropdown-item>
                    </b-dropdown>
                  </div>
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
                aria-controls="note-table"
              ></b-pagination>
          </b-col>
        </b-row>
      </b-col>
    </b-card>
  </div>
</template>

<script>
import { dateFormat, userAccess, viewAccess } from '@/utils/utils.js';
import vSelect from 'vue-select'

export default {
  components: {
    vSelect
  },
  data() {
    return {
      stackedStatus:"md",
      showSpinner: false,
      fields: [
        { key: 'selected', label: '' },
        { key: 'creator', label: 'Creator', filterable: true, sortable: true },
        { key: 'receiver', label: 'Receiver', filterable: true, sortable: true },
        { key: 'subject', label: 'Subject', filterable: true, sortable: true },
        { key: 'content', label: 'Content', filterable: true, sortable: true },
        { key: 'createdAtFormatted', label: 'Created At', filterable: true, sortable: true },
        { key: 'updatedAtFormatted', label: 'Updated At', filterable: true, sortable: true },
        { key: 'actions', label: 'Actions'},
      ],
      //sort direction list
      directions: [
        { key: false, label: 'Asc', sortable: true },
        { key: true, label: 'Desc', sortable: true },
      ],
      search: null,
      promptAddEdit: false,
      addEdit: '',
      title: '',
      pageOptions: [5, 10, 20, 100],
      sortBy: '',
      sortDesc: false,
      form: {
        subject: '',
        creator: '',
        receiver: '',
        content: '',
      },
      // promptView: false,
      promptDelete: false,
      promptDeleteSelected: false,
      deleteCounter: 0,
      selected: [],
      currentPage: 1,
      perPage: 10,
    }
  },
  methods: {
    // add spinner while loading on searching data process
    debounceSearch(event) {
      this.showSpinner = true
      clearTimeout(this.debounce)
      this.debounce = setTimeout(() => {
        this.showSpinner = false
        this.search = event.target.value
      }, 600)
    },

    onRowSelected(items) {
      this.selected = items
    },

    addNote() {
      this.promptAddEdit = true;
      this.title = 'Add Note';
      this.addEdit = 'Add';
      console.log(this.$store.getters['user/getUser']);
      this.clearFields();
    },

    editNote(id) {
      this.promptAddEdit = true;
      this.title = 'Edit Note';
      this.addEdit = 'Edit';
      this.note = this.notes.find(i => i.id === id);
      this.form = {
        ...this.note
      }
    },

    save() {
      this.addEdit === 'Add' ? this.addNewNote() : this.updateNote()
    },

    addNewNote() {
      this.$store
        .dispatch('note/addNote', {
          subject: this.form.subject,
          creator: this.user.email,
          receiver: this.form.receiver.email,
          content: this.form.content,
        })
        .then(() => {
          this.$bvToast.toast('Note Added Successfully', {
            title: 'Success',
            variant: 'success',
            solid: true,
          })
          this.clearFields();
          this.promptAddEdit = false;
        })
        .catch(err => {
          console.log({ err })
          this.$bvToast.toast(err.response.data.errors[0].message, {
            title: 'Failed',
            variant: 'danger',
            solid: true,
          })
        })
    },

    updateNote() {
      this.form.receiver = this.form.receiver.email;
      this.$store
        .dispatch('note/updateNote', {
          id: this.note.id,
          data: {
            ...this.form,
            app: this.$session.get('phibase-app')
          }
        })
        .then(() => {
          this.$bvToast.toast('Note Updated Successfully', {
            title: 'Success',
            variant: 'success',
            solid: true,
          })
          this.clearFields();
          this.promptAddEdit = false;
        })
        .catch(err => {
          console.log({ err });
          this.$bvToast.toast(err.response.data.errors[0].message, {
            title: 'Failed',
            variant: 'danger',
            solid: true,
          })
        });
    },

    deleteNote(id) {
      this.deleteId = id
      this.promptDelete = true
    },
    
    confirmDelete() {
      this.promptDelete = false
      this.$store
        .dispatch('note/deleteNote', { id: this.deleteId })
        .then(() => {
          this.$bvToast.toast('Note Deleted Successfully', {
            title: 'Success',
            variant: 'success',
            solid: true,
          })
          this.selected = [];
        })
        .catch(error => {
          console.log({ error })
          this.$bvToast.toast(error.response.data.errors[0].message, {
            title: 'Failed',
            variant: 'danger',
            solid: true,
          })
        })
    },

    deleteMultiple() {
      if (this.deleteCounter === 0) {
        this.temp = this.selected;
      }
      if (this.deleteCounter < this.temp.length) {
        setTimeout(() => {
          this.deleteId = this.temp[this.deleteCounter].id;
          
          this.deleteCounter++;
          this.confirmDelete();
          this.deleteMultiple();
        }, 50)
      } else {
        this.deleteCounter = 0;
        this.promptDeleteSelected = false;
      }
    },

    clearFields() {
      this.form = {
        subject: '',
        creator: '',
        receiver: '',
        content: ''
      }
    }
  },
  computed: {
    
    permission() {
      return userAccess('note')
    },

    home() {
      return viewAccess()[0]
    },

    user() {
      var getUser = this.$store.getters['auth/getActiveUser'];

      var firstName = getUser.props ? getUser.props.firstName ? getUser.props.firstName : '' : '';
      var lastName = getUser.props ? getUser.props.lastName ? getUser.props.lastName : '' : '';

      this.name = (`${firstName} ${lastName}`).trim();

      return getUser
    },

    users() {
      var getUsers = this.$store.getters['user/getUser'] ? this.$store.getters['user/getUser']
      .filter(doc => {return doc.role !== 'Super Admin'})
      .map(el => {
        return {
          ...el,
          level: el.roleRef.level,
          createdAtFormatted: dateFormat(el.createdAt),
          updatedAtFormatted: dateFormat(el.updatedAt)
        }
      }) : []
      return getUsers
    },
    
    receiver() {
      var getReceiver = this.$store.getters['user/getUser'] ? this.$store.getters['user/getUser']
      .filter(doc => {return doc.role !== 'Super Admin'})
      .map(el => {
        return {
          email: `${el.email}`
        }
      }) : []
      return getReceiver
    },

    notes() {
      var getNotes = this.$store.getters['note/getNote'] ? this.$store.getters['note/getNote']
      .map(el => {
        return {
          ...el,
          // subject: el.props ? el.props.subject ? el.props.subject : 'Not Set Up' : 'Not Set Up',
          // creator: el.props ? el.props.creator ? el.props.creator : 'Not Set Up' : 'Not Set Up',
          // receiver: el.props ? el.props.receiver ? el.props.receiver : 'Not Set Up' : 'Not Set Up',
          // content: el.props ? el.props.content ? el.props.content : 'Not Set Up' : 'Not Set Up',
          createdAtFormatted: dateFormat(el.createdAt),
          updatedAtFormatted: dateFormat(el.updatedAt)
        }
      }) : []
      return getNotes
    },

    rows() {
      return this.notes.length
    },

    // Create an options list from our fields
    sortOptions() {
      return this.fields
        .filter(f => f.sortable)
        .map(f => {
          return { text: f.label, value: f.key }
        })
    },
    // Create a direction list that can be saved in session
    directionOptions() {
      return this.directions
        .filter(f => f.sortable)
        .map(f => {
          return { text: f.label, value: f.key }
        })
    },
  },

  created() {
    document.title = 'Note | Phibase - Common'
  },
  
  mounted() {
    this.$store
      .dispatch('note/fetchNote')
      .catch(err => console.log(err))
    
      // Saving Menu Setting on localstorage session so it still same even after reloading the page
    if (this.$session.has("perPageNoteCommon")) {
      this.perPage = this.$session.get("perPageNoteCommon")
    }
    if (this.$session.has("sortByNoteCommon")) {
      this.sortBy = this.$session.get("sortByNoteCommon")
    }
    if (this.$session.has("sortDescNoteCommon")) {
      this.sortDesc = this.$session.get("sortDescNoteCommon")
    }
  },

  watch: {
    // Taking the Menu Setting from localstorage session so the setting will be the same as before
    perPage(perPageNew) {
      this.$session.set("perPageNoteCommon", perPageNew)
    },
    sortBy(sortByNew) {
      this.$session.set("sortByNoteCommon", sortByNew)
    },
    sortDesc(sortDescNew) {
      this.$session.set("sortDescNoteCommon", sortDescNew)
    },
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