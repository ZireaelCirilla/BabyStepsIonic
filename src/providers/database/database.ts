import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseProvider {

  db: SQLiteObject = null;

  constructor() {

  }

  setDatabase(db: SQLiteObject) {
    if (this.db === null) {
      this.db = db;
    }
  }

  createTable(){
    let sql = 'CREATE TABLE IF NOT EXISTS notification(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, date TEXT)';
    return this.db.executeSql(sql, []);
  }

  getAll() {
    console.log("se ejecuta getAll");
    let sql = 'SELECT * FROM notification';
    return this.db.executeSql(sql, [])
    .then(response => {
      let notifications = [];
      for (let index = 0; index < response.rows.length; index++) {
        notifications.push( response.rows.item(index) );
      }
      return Promise.resolve( notifications );
    })
    .catch(error => Promise.reject(error));
  }

  create(notification: any){
    console.log("CREATE");
    let sql = 'INSERT INTO notification(title, content, date) VALUES(?,?,?)';
    return this.db.executeSql(sql, [notification.title, notification.content, notification.date]);
  }

  update(notification: any){
    let sql = 'UPDATE notification SET title=?, content=?, date=? WHERE id=?';
    return this.db.executeSql(sql, [notification.title, notification.content, notification.date, notification.id]);
  }

  delete(notification: any){
    let sql = 'DELETE FROM notification WHERE id=?';
    return this.db.executeSql(sql, [notification.id]);
  }
}
// class Notification {
//   id: number;
//   title: string;
//   content: string;
//   date: Date;
// }