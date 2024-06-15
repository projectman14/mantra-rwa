// firebaseUtils.ts

import { database } from './firebaseConfig';
import { ref, set, push, get, remove, child } from 'firebase/database';

interface DataObject {
  sender: string;
  Collatral: string;
  mobnumber: string;
  amount: string;
  days: string;
}

export const saveData = async (data: DataObject): Promise<void> => {
  const newDataRef = push(ref(database, 'data'));
  await set(newDataRef, data);
};

export const fetchData = async (): Promise<DataObject[]> => {
  const dbRef = ref(database);
  const snapshot = await get(child(dbRef, 'data'));
  
  if (snapshot.exists()) {
    const data = snapshot.val();
    return Object.keys(data).map(key => ({ id: key, ...data[key] }));
  } else {
    return [];
  }
};

export const deleteData = async (id: string): Promise<void> => {
  const dataRef = ref(database, `data/${id}`);
  await remove(dataRef);
};
