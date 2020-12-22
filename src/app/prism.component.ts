import { Injectable, Inject } from '@angular/core';

import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import 'clipboard';

import 'prismjs';
import 'prismjs/plugins/toolbar/prism-toolbar';
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-http';
// import 'prismjs/components/prism-php';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-sass';
import 'prismjs/components/prism-scss';


declare var Prism: any;

@Injectable()
export class HighlightService {

    constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

    start(callback) {
        if (isPlatformBrowser(this.platformId)) {
            Prism.highlightAll();

            Prism.plugins.toolbar.registerButton('toCompiler', {
                text: 'Jalankan', // required
                onClick: function (env) { // optional
                    let lang = ""
                    switch (env.language) {
                        case "markup": case "php": case "css": lang = "html"; break;
                        case "javascript": lang = "njs"; break;
                        case "python": lang = "py"; break;
                        case "c": lang = "c"; break;
                        case "cpp": lang = "cpp"; break;
                        case "java": lang = "jv"; break;
                    }
                    //open in new tab
                    callback({ newTab: false ,lang: lang, code: encodeURIComponent(env.code).replace(/\(/g, "%28").replace(/\)/g, "%29") })
                }
            });

            Prism.plugins.toolbar.registerButton('toCompilerTab', {
                text: 'Tab baru', // required
                onClick: function (env) { // optional
                    let lang = ""
                    switch (env.language) {
                        case "markup": case "php": case "css": lang = "html"; break;
                        case "javascript": lang = "njs"; break;
                        case "python": lang = "py"; break;
                        case "c": lang = "c"; break;
                        case "cpp": lang = "cpp"; break;
                        case "java": lang = "jv"; break;
                    }
                    //open in new tab
                    callback({ newTab: true ,lang: lang, code: encodeURIComponent(env.code).replace(/\(/g, "%28").replace(/\)/g, "%29") })
                }
            });
        }
    }
}