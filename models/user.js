/** User class for message.ly */
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { BCRYPT_WORK_FACTOR, SECRET_KEY } = require("../config")
const db = require('../db');
const ExpressError = require("../expressError");
/** User of the site. */

class User {

  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */
  constructor({ username, password, first_name, last_name, phone }) {

    this.username = username;
    this.password = password;
    this.first_name = first_name;
    this.last_name = last_name;
    this.phone = phone;

  }

  static async register({ username, password, first_name, last_name, phone }) {
    try {
      console.log("INSIDE REGISTER METHOD");
      const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
      const result = await db.query(`INSERT INTO users (username, password, first_name, last_name, phone)
      VALUES ($1,$2,$3,$4,$5,current_timestamp,current_timestamp) RETURNING *`,
        [username, hashedPassword, first_name, last_name, phone]);
      console.log(`RESULT INSIDE REGISTER ${result}`);

      return result.rows[0];


    } catch (error) {
      if (error.code === '23505') {
        throw new ExpressError("Username taken, Please pick another", 400);
      }
      else if (error.code === '23502') {
        throw new ExpressError("Values required", 400);
      }
    }
  }

  /** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticate(username, password) { }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) { }

  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */

  static async all() { }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) { }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) { }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {id, first_name, last_name, phone}
   */

  static async messagesTo(username) { }
}


module.exports = User;