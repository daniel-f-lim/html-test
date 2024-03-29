var topics1 = null
var topics2 = null
var sortable_topics = null

var letters = null
var contents = null

async function load_data() {
	const response1 = await fetch('https://raw.githubusercontent.com/daniel-f-lim/html-test/master/r_e_topic_corres_count.json')
	topics = await response1.json()
			
	const response2 = await fetch('https://raw.githubusercontent.com/daniel-f-lim/html-test/master/r_e_corres_theme_group.json')
	letters = await response2.json()
	
	const response3 = await fetch('https://raw.githubusercontent.com/daniel-f-lim/html-test/master/connection_corres.json')
	contents = await response3.json()
	
	create_sortable_topics()
	create_option_list("topics1")
	create_option_list("topics2")
}

function display_content(id) {
	let content = contents.find(el => el["unique_id"] === id)["content"]["text"]["translated_text"]
	
	document.getElementById("letter").innerHTML = content
}

function filter(topic) {
	var result = {
		"title": {
			"text": {
				"headline": topic,
				"text": "<p>Elisabeth-Descartes Correspondence</p>"
			},
			"media": {
				"url": "images/e2d-1643-05-06.jpg",
				"caption": "A captivating picture of the princess",
				"credit": "Royal Museums Greenwich"
			}
		},
		"events" : [
		]
	}	
	
	const data = topics[topic]["count_letter_detailed"]
	var flag = true
	
	for(var id in data) {
		var media = {"url": "","caption": "","credit": ""}
		var start_date = {"day": "","month": "","year": ""}
		var text = {"headline": "","text": ""}
	
		let letter = letters.find(el => el["unique_id"] === id)		
		let tokens = letter["date"][0].split(",")[0].split("/")
				
		start_date["day"] = tokens[1] === "??" ? "1" : String(Number(tokens[1]))
		start_date["month"] = tokens[0] === "??" ? "1" : String(Number(tokens[0]))
		start_date["year"] = String(Number(tokens[2]))

		text["headline"] = letter["from"] + " -> " + letter["to"]
		text["text"] = "Written at: " + letter["location"] + `<p>
		<button id='${id}'>see letter</button>
		</p>`

		if(flag) {
			result["events"].push({media,start_date,text,"group":"group1"})
			flag = false
		} else {
			result["events"].push({media,start_date,text,"group":"group2"})
			flag = true
		}
	}
	
	return result
}

function filter2(t1,t2) {
	var result = {
		"title": {
			"text": {
				"headline": t1+"/"+t2,
				"text": "<p>Elisabeth-Descartes Correspondence</p>"
			},
			"media": {
				"url": "images/e2d-1643-05-06.jpg",
				"caption": "A captivating picture of the princess",
				"credit": "Royal Museums Greenwich"
			}
		},
		"events" : [
		]
	}	
	
	const data1 = topics[t1]["count_letter_detailed"]
	const data2 = topics[t2]["count_letter_detailed"]
	
	for(var id in data1) {
		var media = {"url": "","caption": "","credit": ""}
		var start_date = {"day": "","month": "","year": ""}
		var text = {"headline": "","text": ""}
	
		let letter = letters.find(el => el["unique_id"] === id)		
		let tokens = letter["date"][0].split(",")[0].split("/")
				
		start_date["day"] = tokens[1] === "??" ? "1" : String(Number(tokens[1]))
		start_date["month"] = tokens[0] === "??" ? "1" : String(Number(tokens[0]))
		start_date["year"] = String(Number(tokens[2]))

		text["headline"] = letter["from"] + " -> " + letter["to"]
		text["text"] = "Written at: " + letter["location"] + `<p>
		<button id='${id}'>see letter</button>
		</p>`

		result["events"].push({media,start_date,text,"group":t1})
	}
	
	for(var id in data2) {
		var media = {"url": "","caption": "","credit": ""}
		var start_date = {"day": "","month": "","year": ""}
		var text = {"headline": "","text": ""}
	
		let letter = letters.find(el => el["unique_id"] === id)		
		let tokens = letter["date"][0].split(",")[0].split("/")
				
		start_date["day"] = tokens[1] === "??" ? "1" : String(Number(tokens[1]))
		start_date["month"] = tokens[0] === "??" ? "1" : String(Number(tokens[0]))
		start_date["year"] = String(Number(tokens[2]))

		text["headline"] = letter["from"] + " -> " + letter["to"]
		text["text"] = "Written at: " + letter["location"] + `<p>
		<button id='${id}'>see letter</button>
		</p>`

		result["events"].push({media,start_date,text,"group":t2})
	}

	return result
}

function create_sortable_topics() {
	var result = []

	keys = Object.keys(topics)
	for(let i = 0; i < keys.length; i++) {
		var entry = {
			"topic": "",
			"count_occurrence": ""
		}
		
		entry["topic"] = keys[i]
		entry["count_occurrence"] = topics[keys[i]]["count_occurrence"]
		
		result.push(entry)
	}
	
	sortable_topics = result
}

function create_option_list(name) {
	alpha = sortable_topics.sort((a,b) => {
		if (a.topic.toLowerCase() < b.topic.toLowerCase()) {
			return -1
		}
	})

	options = document.getElementById(name)
	options.innerHTML = ""

	for (let i = 0; i < alpha.length; i++) {
		option = document.createElement("option")
		option.value = alpha[i]["topic"]
		option.innerHTML = alpha[i]["topic"]
		options.appendChild(option)
	}
}

function change(obj) {
	const result = filter(obj.value)
	window.timeline = new TL.Timeline('timeline-embed', result)

	setTimeout(() => {
		var elems = document.getElementsByClassName('tl-slider-item-container')[0].childNodes

		for(let i = 1; i < elems.length; i++) {
			btn = elems[i].getElementsByTagName('button')[0]
			btn.setAttribute('onclick',`display_content('${btn.id}')`)
		}

	}, 20)

}

function create_TL() {
	var t1 = document.getElementById('topics1')
	var t2 = document.getElementById('topics2')

	const result = filter2(t1.value, t2.value)
	window.timeline = new TL.Timeline('timeline-embed', result)

	setTimeout(() => {
		var elems = document.getElementsByClassName('tl-slider-item-container')[0].childNodes

		for(let i = 1; i < elems.length; i++) {
			btn = elems[i].getElementsByTagName('button')[0]
			btn.setAttribute('onclick',`display_content('${btn.id}')`)
		}

	}, 20)
}