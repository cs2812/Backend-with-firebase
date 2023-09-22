import { getDatabase, ref, get, child, update } from "firebase/database";
const db = getDatabase();

export const GetUser = async (id) => {
  let data = {};
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `users/${id}`));
    if (snapshot.exists()) {
      data = await snapshot.val();
    } else {
      console.log("No data available");
    }
  } catch (error) {
    console.error(error);
  }
  return data;
};

export const GetList = async (collection) => {
  let data = [];
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, collection));
    if (snapshot.exists()) {
      let response = snapshot.val();
      data = Object.values(response);
    } else {
      console.log("No data available");
    }
  } catch (error) {
    console.error(error);
  }
  return data;
};

export const handleUserActive = (user) => {
  //   console.log("checkKeys",newPostKey)
  let postData = { ...user, onLine: true };
  const updates = {};
  updates["/users/" + user.uid] = postData;
  return update(ref(db), updates);
};
export const handleUserDeactivate = (user) => {
  //   console.log("checkKeys",newPostKey)
  let postData = { ...user, onLine: false };
  const updates = {};
  updates["/users/" + user.uid] = postData;
  return update(ref(db), updates);
};
