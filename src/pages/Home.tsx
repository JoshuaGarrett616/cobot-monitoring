import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonModal, IonList, 
    IonItem, IonInput, IonAlert, IonLabel, IonRow, IonCol} from '@ionic/react';
import React, { useState, useEffect } from 'react';
import NumPad from 'react-numpad'
//import ExploreContainer from '../components/ExploreContainer';
import firebase from '../Firebase';
import './Home.css';

interface Cobot{
	name: string;
    ip: string;
    type: string;
    areaDesc: string;
    jobDesc: string;
}


const Home: React.FC = () => {

  const [showCobotModal, setShowCobotModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentIp, setIp] = useState("Nothing");
  const [currentName, setName] = useState("Nothing");
  const [currentType, setType] = useState("Nothing");
  const [currentJob, setJob] = useState("Nothing");
  const [currentArea, setArea] = useState("Nothing");
  const [cobot_list, setList] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [showEntry, setShowEntry] = useState(false);

  const [password, setPermission] = useState('');
  const [firstLevel, setFirstLevel] = useState("");
  const [secondLevel, setSecondLevel] = useState("");

  const [newName, setNewName] = useState("");
  const [newIp, setNewIp] = useState("");
  const [newType, setNewType] = useState("");
  const [newArea, setNewArea] = useState("");
  const [newJob, setNewJob] = useState("");

  var database = firebase.firestore();
  var permissions = database.collection("Permissions");

  permissions.doc("firstLevel")
    .get()
    .then(function(doc){
        if(doc.exists){
            setFirstLevel(doc.data().pin);
        }
    })

    permissions.doc("secondLevel")
    .get()
    .then(function(doc){
        if(doc.exists){
            setSecondLevel(doc.data().pin);
        }
    })

  database.collection("Cobots")
    .get()
    .then(querySnapshot =>{
        const data = querySnapshot.docs.map(doc => doc.data());
        setList(data);
    });

  function pinCheck(pin){
    let fLevel = parseInt(firstLevel);
    let sLevel = parseInt(secondLevel);
    let pLevel = parseInt(pin);
    if(pLevel === fLevel){
        setPermission("1");
        setShowEntry(false);
    }
    else if (pLevel === sLevel) {
        setPermission("2")
        setShowEntry(false);
    }
  }

  function writeUserData(cobot: Cobot){
      database.collection("Cobots").doc(cobot.name).set({
          name: cobot.name,
          ip: cobot.ip,
          type: cobot.type,
          areaDesc: cobot.areaDesc,
          jobDesc: cobot.jobDesc
      });
  };

  function handleCobotModal(cobot: Cobot){
	setIp(cobot.ip);
	setName(cobot.name);
    setType(cobot.type);
    setArea(cobot.areaDesc);
    setJob(cobot.jobDesc);
	setShowCobotModal(true);
  }

  function handleAddModal(){
    let empty = "";
    if(newName.localeCompare(empty) !== 0 && newIp.localeCompare(empty) !== 0 &&
        newType.localeCompare(empty) !== 0 && newJob.localeCompare(empty) !== 0 &&
        newArea.localeCompare(empty) !== 0) {
        let cobot: Cobot = {
            name: newName,
            ip: newIp,
            type: newType,
            areaDesc: newArea,
            jobDesc: newJob
        }
        writeUserData(cobot);
        setNewName("");
        setNewIp("");
        setNewType("");
        setNewArea("");
        setNewJob("");
        setShowAddModal(false);
    }
  }

  return (
    <IonPage>

      <IonHeader>
        <IonToolbar color = "primary">
          <IonTitle>Cobot Monitoring</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Cobot Monitoring</IonTitle>
          </IonToolbar>
        </IonHeader>
        <p>
          <IonButton onClick={() => setShowAddModal(true)} color="primary" expand="block">
            Add Cobot
          </IonButton>
        </p>
        {cobot_list.map((cobot, index) => (<p>
            <IonButton onClick={() => handleCobotModal(cobot)} 
                color="primary" expand="block">
                {cobot.name}
            </IonButton>
        </p>))}
      </IonContent>

      <IonModal isOpen={showCobotModal} 
	  cssClass="primary"
	  swipeToClose={true}
	  onDidDismiss={() => setShowCobotModal(false)}>
	    <IonContent>
	      <IonHeader>
            <IonToolbar color = "primary">
              <IonTitle>{currentName}</IonTitle>
            </IonToolbar>
          </IonHeader>
	      <p>
		    <img height="400" width="600" src={'http://'+currentIp+':8000/stream.mjpg'}/>
		  </p>
          <IonList>
            <IonItem>
              {currentType}
            </IonItem>
            <IonItem>
              {currentArea}
            </IonItem>
            <IonItem>
              {currentJob}
            </IonItem>
          </IonList>
		</IonContent>
		<IonButton onClick={() => setShowCobotModal(false)}>Close</IonButton>
        <IonButton onClick={() => setShowDelete(true)}>Delete Bot</IonButton>
	  </IonModal>

      <IonModal isOpen={showAddModal}
      cssClass="primary"
	  swipeToClose={true}
	  onDidDismiss={() => setShowAddModal(false)}>
        <IonContent>
          <IonHeader>
            <IonToolbar color = "primary">
              <IonTitle>Add Cobot</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonList>
            <IonItem>
              <IonInput placeholder="Cobot Name" onIonChange={e => {setNewName(e.detail.value!); console.log(e.detail.value)}}></IonInput>
            </IonItem>
            <IonItem>
              <IonInput placeholder="Raspberry Ip" onIonChange={e => setNewIp(e.detail.value!)}></IonInput>
            </IonItem>
            <IonItem>
              <IonInput placeholder="Cobot Type" onIonChange={e => setNewType(e.detail.value!)}></IonInput>
            </IonItem>
            <IonItem>
              <IonInput placeholder="Cobot Area" onIonChange={e => setNewArea(e.detail.value!)}></IonInput>
            </IonItem>
            <IonItem>
              <IonInput placeholder="Cobot Job" onIonChange={e => setNewJob(e.detail.value!)}></IonInput>
            </IonItem>
          </IonList>
        </IonContent>
        <IonButton onClick={() => handleAddModal()}>Add</IonButton>
        <IonButton onClick={() => setShowAddModal(false)}>Cancel</IonButton>
      </IonModal>
          
      <IonAlert
        isOpen={showDelete}
        onDidDismiss={() => setShowDelete(false)}
        cssClass="primary"
        header={'Delete'}
        message={'Delete this Cobot?'}
        buttons={[
            {
              text: 'Cancel',
              handler: () => {
                setShowDelete(false);
              }
            },
            {
              text: 'Confirm',
              handler: () => {
                database.collection("Cobots").doc(currentName).delete();
                setShowCobotModal(false);
              }
            }
        ]}
        />

    </IonPage>
  );
};

export default Home;
