
const $ = require('jquery');

class AjaxManager{
	constructor(){

		this.ajaxQueue = [];
		this.loadComplete = true;
	}

	load( urls=[], complete=function(){} ,authorization){
		if(!this.loadComplete)
			this.ajaxQueue.push({ urls: urls, complete: complete });

		if(!urls.length)
			return;

		this.loadComplete = false;
		
		let cur = this;
		let loaded = 0;
		let out = {};
		for(let i=0; i<urls.length; i++){

			$.ajax({
				type: "get",
				data: urls[i].data || {},
				url: urls[i].url,
                headers: {
                    'authorization': authorization
                },
				success: function(json){
					loaded++;

					out[urls[i].id] = json;

					if(loaded==urls.length){
						cur.loadComplete = true;
						complete(out);

						if(cur.ajaxQueue.length){
							cur.load(cur.ajaxQueue[cur.ajaxQueue.length-1].urls, cur.ajaxQueue[cur.ajaxQueue.length-1].complete);
							cur.ajaxQueue.pop();
						}
					}
				},
				error: function(error){
					console.error(error,"出现的报错信息");
					if(error.status == 401){
                        window.sessionStorage.removeItem("authorization");
                        // window.open("./page1.html")
                        // window.close();
                        window.location.href =  './page1.html';
					}
					loaded++;

					if(loaded==urls.length){
						cur.loadComplete = true;
						complete(out);

						if(cur.ajaxQueue.length){
							cur.load(cur.ajaxQueue[cur.ajaxQueue.length-1].urls, cur.ajaxQueue[cur.ajaxQueue.length-1].complete);
							cur.ajaxQueue.pop();
						}
					}
				}
			});
		}
	}
	

}

export default AjaxManager;
