import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useParams } from 'react-router';
import CavesList from '../CavesList';
import ExploreContainer from '../components/ExploreContainer';

const NotFound: React.FC = () => {

  const { name } = useParams<{ name: string; }>();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">not found!!!! {name}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name={name} />
        <CavesList />
      </IonContent>
    </IonPage>
  );
};

export default NotFound;
