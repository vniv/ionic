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
              at: new Date(deadlineDate.getDate() + 5000),
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
    await LocalNotifications.requestPermissions();
  }


  async testNotification() {
    await LocalNotifications.schedule({
      notifications: [
        {
          id: 1,
          title: "Notification Test",
          body: "Ceci est une notification locale",
          schedule: { at: new Date(Date.now() + 5000) }
        }
      ]
    });
  }
}
