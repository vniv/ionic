import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  async scheduleNotification(tache: any, index: number) {
    
    const deadlineDate: Date = new Date(new Date(tache.deadline).getTime() + 2000);
    
    if (deadlineDate > new Date()) {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: index + 1,
            title: 'Rappel de tâche',
            body: `La tâche "${tache.title}" est à rendre pour aujourd'hui.`,
            schedule: {
              at: deadlineDate,
            },
            sound: 'default',
            smallIcon: 'icon',
            channelId: 'todo-reminders',
          },
        ],
      });
    } else {
      console.warn('La deadline est déjà passée ou invalide.');
    }
  }


  async requestNotificationPermission() {
    const permission = await LocalNotifications.requestPermissions();
    if (permission.display === 'granted') {
      console.log('Permission de notification accordée.');
    } else {
      console.error('Permission de notification refusée.');
    }
  }
}
