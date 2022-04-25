'use strict';

const fs = require("fs");
const path = require("path");

module.exports = class Utils {

  /**
   * Is the source a directory.
   *
   * @param source
   * @returns {boolean}
   */
  isDirectory (source) {
    return fs.lstatSync(source).isDirectory();
  }

  /**
   * Is source a file.
   *
   * @param source
   * @returns {boolean}
   */
  isFile (source) {
    try {
      if (fs.existsSync(source)) {
        return fs.lstatSync(source).isFile() || fs.lstatSync(source).isSymbolicLink();
      }
    } catch(err) {
      return false
    }

    return false;
  }

  /**
   * Get all directories at source.
   *
   * @param source
   * @returns {string[]}
   */
  getDirectories (source) {
    return fs.readdirSync(source).map(name => path.join(source, name)).filter(this.isDirectory);
  }

  /**
   * Get all files at source.
   *
   * @param source
   * @returns {string[]}
   */
  getFiles (source) {
    return fs.readdirSync(source).map(name => path.join(source, name)).filter(this.isFile);
  }
}
