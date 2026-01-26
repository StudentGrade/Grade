export type NotificationType = 'loading' | 'success' | 'error' | 'info';

export interface Notification {
	id: string;
	message: string;
	type: NotificationType;
	stopwatch?: number;
	reportPeriodName?: string;
}

export const notificationState = $state({
	notifications: [] as Notification[],
	loadingNotification: null as Notification | null,
	stopwatch: 0 as number
});

let notificationCounter = 0;

export function showLoadingNotification(reportPeriodName: string, status: 'pending' | 'receiving') {
	const notification: Notification = {
		id: `loading-${++notificationCounter}`,
		message: `Loading ${reportPeriodName} grades...`,
		type: 'loading',
		reportPeriodName,
		stopwatch: 0
	};
	notificationState.loadingNotification = notification;
}

export function hideLoadingNotification() {
	notificationState.loadingNotification = null;
}

export function showNotification(message: string, type: NotificationType = 'info', duration = 5000) {
	const notification: Notification = {
		id: `${type}-${++notificationCounter}`,
		message,
		type
	};
	notificationState.notifications.push(notification);

	if (duration > 0) {
		setTimeout(() => {
			removeNotification(notification.id);
		}, duration);
	}

	return notification.id;
}

export function removeNotification(id: string) {
	notificationState.notifications = notificationState.notifications.filter(n => n.id !== id);
}

