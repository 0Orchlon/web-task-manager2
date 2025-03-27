export default function ({ store, redirect }) {
    const user = firebase.auth().currentUser;
    if (!user) {
      return redirect('/');
    }
  }
  