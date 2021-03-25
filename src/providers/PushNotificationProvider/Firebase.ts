import * as admin from 'firebase-admin';

import serviceAccount from '../../config/FirebaseConfig/model-e6629-firebase-adminsdk-4qb84-7b585420c5.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
