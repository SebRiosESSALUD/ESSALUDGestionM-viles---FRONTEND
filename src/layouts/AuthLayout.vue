<template>
    <div class="auth-layout">
      <div class="auth-container">
        <slot></slot>
      </div>
    </div>
  </template>
  
  <style scoped>
  .auth-layout {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: #f5f5f5;
  }
  
  .auth-container {
    width: 400px;
    padding: 2rem;
    background: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    text-align: center;
  }
  </style>
  