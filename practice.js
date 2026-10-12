const loginDialog = document.querySelector('#login-dialog');


// Open login dialog
document.querySelectorAll('[data-login]').forEach((button) => {

  button.addEventListener('click', () => {
    loginDialog.showModal();
  });

});


// Close login dialog using X or Okay button
document.querySelectorAll('.close, .close-action').forEach((button) => {

  button.addEventListener('click', () => {
    loginDialog.close();
  });

});


// Close dialog when clicking outside the dialog box
loginDialog.addEventListener('click', (event) => {

  if (event.target === loginDialog) {
    loginDialog.close();
  }

});