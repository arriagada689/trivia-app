import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", {
    state: () => ({
      isLoggedIn: ref(!!localStorage.getItem("userInfo")), 
    }),
    actions: {
      login(userData) {
        localStorage.setItem("userInfo", JSON.stringify(userData));
        this.isLoggedIn = true; // Update state
      },
      logout() {
        localStorage.removeItem("userInfo");
        this.isLoggedIn = false; // Update state
      },
    },
});