Inventory APP - Music Library

models:
   * genre:
     * name
   * artist: 
     * name - first and last name
     * dob - dod
   * album: 
     * name
     * released date
     * genre
     * description
     * price
   * track:
     * name

relations: 
* genre 1 - 0/* alubum  (1 to 0 or many)
* genre 1/* - 1 artist  (1 or many to 1)
* artist 1 - 1/* album  (1 to 1 or many)
* album 1 - 1 track  (1 to 1)

categories: types
* genre:
* artist
* albums
* tracks

category model: 
* name
* description
* url
* item count

category view:
* name
* artist
* released date

views details:
   * genre:
     * name
     * albums count

   * artist: 
     * name - first and last name
     * albums list - if any
     * dob - dod

   * album: 
     * name
     * track list
     * released date
     * stock - amount / status
     * genre
     * description
     * price

   * track:
     * name
     * alubum name
     * genre