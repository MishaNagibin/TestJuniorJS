<template>
  <form @submit.prevent="submit">
    <v-text-field
      v-model="sname"
      :error-messages="errorSname"
      required
      label="Фамилия"
    />
    <v-text-field
      v-model="name"
      :error-messages="errorName"
      required
      label="Имя"
    />
    <v-text-field
      v-model="pname"
      :error-messages="errorPname"
      required
      label="Отчество"
    />
    <v-text-field
      v-model="email"
      :error-messages="errorEmail"
      required
      label="E-mail"
    />
    <v-btn class="mr-4" type="submit" :disabled="hasErrors">
      {{ isEdit ? "Сохранить" : "Добавить" }}
    </v-btn>
    <v-btn v-if="!isEdit" @click="cancel"> Отмена </v-btn>
  </form>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "c-form",
  props: ["isEdit", "user"],
  data() {
    return {
      name: "",
      sname: "",
      pname: "",
      email: "",
      errorSname: "",
      errorName: "",
      errorPname: "",
      errorEmail: "",
    };
  },
  computed: {
    hasErrors() {
      const { errorSname, errorName, errorPname, errorEmail } = this;
      return Boolean(errorSname || errorName || errorPname || errorEmail);
    },
  },
  watch: {
    sname(n) {
      if ((n ?? "").trim().length > 0) {
        this.errorSname = "";
      }
    },
    name(n) {
      if ((n ?? "").trim().length > 0) {
        this.errorName = "";
      }
    },
    pname(n) {
      if ((n ?? "").trim().length > 0) {
        this.errorPname = "";
      }
    },
    email(n) {
      if ((n ?? "").trim().length > 0) {
        this.errorEmail = "";
      }
    },
    user: {
      handler(n) {
        if (n !== undefined && this.isEdit) {
          this.name = n.name ?? "";
          this.sname = n.sname ?? "";
          this.pname = n.pname ?? "";
          this.email = n.email ?? "";
        }
      },
      immediate: true,
    },
  },
  methods: {
    submit() {
      const { sname, name, pname, email } = this;
      if (sname.trim().length === 0) {
        this.errorSname = "Укажите Фамилию";
      }
      if (name.trim().length === 0) {
        this.errorName = "Укажите Имя";
      }
      if (pname.trim().length === 0) {
        this.errorPname = "Укажите Отчество";
      }
      if (email.trim().length === 0) {
        this.errorEmail = "Укажите Email";
      }

      if (!this.hasErrors) {
        this.$emit("submit", {
          id: this.isEdit ? this.employe.id : null,
          sname,
          name,
          pname,
          email,
        });
        this.cancel();
      }
    },
    cancel() {
      this.sname = "";
      this.name = "";
      this.pname = "";
      this.email = "";
      this.$emit("cancel");
    },
  },
});
</script>
