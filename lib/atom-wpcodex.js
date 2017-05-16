'use babel';

import { CompositeDisposable } from 'atom';
import open from 'open';
import request from 'request';
import cheerio from 'cheerio';
import google from "google";
google.resultsPerPage = 1;

export default {

  subscriptions: null,

  activate(state) {

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-wpcodex:lookup': () => this.lookup()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  lookup() {
	let editor;
    if (editor = atom.workspace.getActiveTextEditor()) {
	  let query = editor.getSelectedText();

	  this.search(query).then((url) => {
        atom.notifications.addSuccess('Found documentation!');
		this.open_url(url);
      }).catch((error) => {
		  if( error.reason == 'Blocked search' ) {
		    this.fallback_search(query, editor);
		  } else {
			  atom.notifications.addWarning(error.reason);
		  }
      });

    }
  },

  search(query) {
	return new Promise((resolve, reject) => {
	  let searchString = `${query} site:wordpress.org`;

	  google(searchString, (err, res) => {
	    if (err) {
	      reject({
	        reason: 'Blocked search'
		  });
	    } else if (res.links.length === 0) {
	      reject({
	        reason: 'No results found :('
		  });
	    } else {
	      resolve(res.links[0].href);
	    }
	  })
	})
  },

  fallback_search(query, editor) {
	atom.notifications.addWarning('WordPress lookup have to perform fallback lookup');
	let url = 'https://developer.wordpress.org/?s=' + query;

	this.download(url).then((html) => {
      let result_url = this.scrape(html);
      if (result_url === '') {
        atom.notifications.addWarning('No documentation found :(');
      } else {
        this.open_url(result_url);
      }
    }).catch((error) => {
      atom.notifications.addWarning(error.reason);
    });

  },

  open_url(url) {
	var open = require("open");
	open(url);
  },

  scrape(html) {
    $ = cheerio.load(html);
    return $('.search-results .site-main article h1 a').attr('href');
  },

  download(url) {
    return new Promise((resolve, reject) => {
      request(url, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          resolve(body);
        } else {
          reject({
            reason: 'Unable to download page'
		  });
        }
	  });
    });
  }

};
