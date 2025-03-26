<template>
  <b-container class="vh-100 d-flex justify-content-center align-items-center">
    <b-card class="p-4 shadow-lg rounded" style="max-width: 400px; width: 100%">
      <h3 class="text-center mb-4">Iniciar Sesión</h3>
      <b-alert v-if="errorMessage" variant="danger" dismissible>{{ errorMessage }}</b-alert>
      
      <b-form @submit.prevent="handleLogin">
        <b-form-group label="Usuario" label-for="input-username">
          <b-input-group>
            <b-input-group-prepend is-text>
              <b-icon-person-fill></b-icon-person-fill>
            </b-input-group-prepend>
            <b-form-input
              id="input-username"
              v-model="username"
              required
              placeholder="Ingrese su usuario"
            ></b-form-input>
          </b-input-group>
        </b-form-group>

        <b-form-group label="Contraseña" label-for="input-password">
          <b-input-group>
            <b-input-group-prepend is-text>
              <b-icon-lock-fill></b-icon-lock-fill>
            </b-input-group-prepend>
            <b-form-input
              id="input-password"
              v-model="password"
              type="password"
              required
              placeholder="Ingrese su contraseña"
            ></b-form-input>
          </b-input-group>
        </b-form-group>

        <b-button type="submit" variant="primary" class="w-100" :disabled="loading">
          <b-spinner small v-if="loading"></b-spinner>
          <span v-else>Iniciar Sesión</span>
        </b-button>
      </b-form>
    </b-card>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      loading: false,
      errorMessage: null,
    };
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      this.errorMessage = null;

      // Simulación de autenticación (aquí iría una petición real)
      setTimeout(() => {
        if (this.username === 'admin' && this.password === '1234') {
          this.$router.push('/dashboard'); // Redirigir a otra vista
        } else {
          this.errorMessage = 'Credenciales incorrectas';
        }
        this.loading = false;
      }, 1500);
    },
  },
};
</script>
