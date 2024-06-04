import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    users: [],
  },
  getters: {},
  actions: {
    init({ commit }) {
      commit("init");
    },
    add({ commit, state }, data) {
      return new Promise((resolve) => {
        const item = { ...data, id: (state.users.at(-1)?.id ?? 0) + 1 };
        resolve([...state.users, item]);
        commit("add", item);
      });
    },
    upd({ commit }, data) {
      return new Promise((resolve) => {
        resolve(data);
        commit("upd", data);
      });
    },
    del({ commit }, index) {
      return new Promise((resolve) => {
        resolve();
        commit("del", index);
      });
    },
    addFriend({ commit, state }, ids) {
      const userIndex = state.users.findIndex((f) => f.id === ids[0]);
      const friendIndex = state.users.findIndex((f) => f.id === ids[1]);
      const user = {
        ...state.users[userIndex],
        index: userIndex,
        friends: [
          ...new Set([...(state.users[userIndex]?.friends ?? []), ids[1]]),
        ],
      };
      const friend = {
        ...state.users[friendIndex],
        index: friendIndex,
        friends: [
          ...new Set([...(state.users[friendIndex]?.friends ?? []), ids[0]]),
        ],
      };
      return new Promise((resolve) => {
        resolve();
        commit("upd", user);
        commit("upd", friend);
      });
    },
    removeFriend({ commit, state }, ids) {
      const userIndex = state.users.findIndex((f) => f.id === ids[0]);
      const user = {
        ...state.users[userIndex],
        index: userIndex,
        friends: state.users[userIndex].friends.filter((f) => f !== ids[1]),
      };
      return new Promise((resolve) => {
        resolve();
        commit("upd", user);
      });
    },
  },
  mutations: {
    init(state) {
      const localStorageUsers = localStorage.getItem("users");
      // небольшой пресет данных, чтобы вручную не делать их
      if (["[]", null].includes(localStorageUsers)) {
        localStorage.setItem(
          "users",
          JSON.stringify([
            {
              id: 1,
              name: "Вася",
              sname: "Васильев",
              pname: "Иванович",
              email: "vasya@mail.ru",
              friends: [2],
            },
            {
              id: 2,
              name: "Петя",
              sname: "Петров",
              pname: "Викторович",
              email: "petya@mail.ru",
              friends: [1, 3],
            },
            {
              id: 3,
              name: "Дима",
              sname: "Дмитров",
              pname: "Олегович",
              email: "dima@mail.ru",
              friends: [1, 2],
            },
          ])
        );
      }
      state.users = JSON.parse(localStorage.getItem("users") ?? "[]");
    },
    add(state, data) {
      state.users.push(data);
      localStorage.setItem("users", JSON.stringify(state.users));
    },
    upd(state, data) {
      state.users.splice(data.index, 1, {
        id: data.id,
        name: data.name,
        sname: data.sname,
        pname: data.pname,
        email: data.email,
        friends: data.friends ?? [],
      });
      localStorage.setItem("users", JSON.stringify(state.users));
    },
    del(state, index) {
      state.users.splice(index, 1);
      localStorage.setItem("users", JSON.stringify(state.users));
    },
  },
});

export default store;
