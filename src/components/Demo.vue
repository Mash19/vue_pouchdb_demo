<template>
  <div class="demo">
    <table>
      <thead>
        <tr>
          <th>Id</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Date of Birth</th>
          <th>Age</th>
          <th>Edit buttons</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item of items" :key="item._id">
          <td>{{item._id}}</td>
          <td>{{item.firstname}}</td>
          <td>{{item.lastname}}</td>
          <td>{{item.dob}}</td>
          <td>{{item.age}}</td>
          <mdc-button @click="edit(item)">Update</mdc-button>
          <mdc-button @click="remove(item)">Delete</mdc-button>
        </tr>
      </tbody>
    </table>
    <fieldset>
      <legend>Inputs</legend>
      <div class="fields">
        <mdc-textfield label="ID (read only)" v-model="input._id" type="text" readonly></mdc-textfield>
        <mdc-textfield label="First Name" v-model="input.firstname" type="text"></mdc-textfield>
        <mdc-textfield label="Last Name" v-model="input.lastname" type="text"></mdc-textfield>
        <mdc-textfield
          label="Date of birth"
          v-model="input.dob"
          @change="getAge"
          type="date"
          pattern="(\d\d?/){2}\d{4}"
        ></mdc-textfield>
        <mdc-textfield label="Age (read only)" v-model="input.age" type="text" readonly></mdc-textfield>
        <div class="buttons">
          <mdc-button v-if="savebtn" class="primary" @click="save">Save</mdc-button>
          <mdc-button v-if="updatebtn" class="primary" @click="update">Update</mdc-button>
          <mdc-button class="secondary" @click="clear">Clear</mdc-button>
        </div>
      </div>
    </fieldset>
  </div>
</template>
<script>
/* global db */
// import VueMDCTextField from 'vue-mdc-adapter/textField'
import shortid from 'shortid';
function ageUnits(strings, yrs, mnth) {
  const suffixes = new Map([['one', 'month'], ['other', 'months']]);
  const pr = new Intl.PluralRules('en-US');
  const formatMonths = n => {
    const rule = pr.select(n);
    const suffix = suffixes.get(rule);
    return `${n} ${suffix}`;
  };
  var ageString = `${yrs} yrs`;
  const months = yrs * 12 + mnth;
  if (yrs < 2) {
    ageString = formatMonths(months);
  }
  return ageString;
}
function formatDate(d) {
  let bdate = d.toLocaleDateString('en', 'short');
  bdate = bdate.replace(
    /(?<month>\d{1,2})\/(?<day>\d{1,2})\/(?<year>\d{4})/,
    '$<year>-$<month>-$<day>'
  );
  return bdate.replace(/\b(\d)\b/g, '0$1');
}
function dateFromString(str) {
  return str.split('-').map((x, i) => {
    if (i === 0) return x;
    return i === 1 ? Number.parseInt(x, 10) - 1 : Number.parseInt(x, 10) + 1;
  });
}

export default {
  data: function() {
    return {
      items: [],
      savebtn: true,
      updatebtn: false,
      input: {
        _id: '',
        firstname: '',
        lastname: '',
        dob: formatDate(new Date()),
        age: '0'
      }
    };
  },
  created: function() {
    this.view();
  },
  methods: {
    getAge: function() {
      let currentAge = 0;
      let monthRange = 0;
      let today = new Date();
      const dob = new Date(Date.UTC(...dateFromString(this.input.dob)));
      const d = today.getDate();
      const m = today.getMonth();
      const y = today.getFullYear();
      const bdd = dob.getDate();
      const bdm = dob.getMonth();
      const bdy = dob.getFullYear();
      currentAge = y - bdy;
      if (currentAge > 0 && (bdm > m || (bdm === m && bdd > d))) {
        currentAge = currentAge - 1;
        monthRange = bdm < m ? m - bdm : 11 - bdm + m;
      } else {
        monthRange = m - bdm;
      }
      this.input.age = ageUnits`${currentAge}${monthRange}`;
    },
    view: function() {
      let vm = this;
      let items = [];
      db.allDocs({
        include_docs: true
      })
        .then(response => {
          items = response.rows.map(x => {
            return x.doc;
          });
          vm.items = items;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    clear: function() {
      this.input = {
        _id: '',
        firstname: '',
        lastname: '',
        dob: formatDate(new Date()),
        age: '0'
      };
      this.savebtn = true;
      this.updatebtn = false;
    },
    edit: function(item) {
      const { _id, firstname, lastname, dob, age } = item;
      this.savebtn = false;
      this.updatebtn = true;
      this.input._id = _id;
      this.input.firstname = firstname;
      this.input.lastname = lastname;
      this.input.dob = formatDate(new Date(Date.UTC(...dateFromString(dob))));
      this.input.age = age;
    },
    update: function() {
      const { _id, firstname, lastname, dob, age } = this.input;
      let i = this.items.findIndex(x => x._id === _id);
      this.items[i] = this.input;
      this.savebtn = true;
      this.updatebtn = false;
      db.get(_id)
        .then(function(doc) {
          return db.put({
            _id: _id.toString(),
            _rev: doc._rev,
            firstname,
            lastname,
            dob,
            age
          });
        })
        .catch(function(error) {
          console.log(error);
        });
      this.clear();
    },
    remove: function(item) {
      const { _id } = item;
      let i = this.items.findIndex(x => x._id === _id);
      this.items.splice(i, 1);
      db.get(item._id).then(function(doc) {
        return db.remove(doc);
      });
    },
    save: function() {
      let { _id, firstname, lastname, dob, age } = this.input;
      _id = shortid.generate();
      db.put({
        _id,
        firstname,
        lastname,
        dob,
        age
      })
        // .then(function(response){

        // })
        .catch(function(error) {
          console.log(error);
        });
      this.items.push({ _id, firstname, lastname, dob, age });
      this.clear();
    }
  }
};
</script>
<style lang="scss" scoped>
.labelText {
  text-transform: capitalize;
}
.demo {
  display: flex;
}
.fields {
  display: flex;
  flex-flow: column nowrap;
}
</style>
