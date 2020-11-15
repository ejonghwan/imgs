const url = "https://www.flickr.com/services/rest/?"; // fliker api 기본 요청 주소
const key = "b7fada8d60a4d10a275193142ce41fad";  // api token
const per_page = 10; // 이미지 요청 갯수
const tagmode = "any"; // 검색방법 (any는 한칸 띄고 검색해도 됨)
const privacy_filter = 5; // 보안수준  5가 제일 많이 검색됨
const format = "json"; // 데이터 형식
const nojsoncallback = 1; // 모든 json은 callback이 있어서 딸려나옴. 이걸 사용안하겠다. 1은 true 0은 false
const interest = "flickr.interestingness.getList"; // 사용자의 관심자가 많은 이미지를 가져오겠다

//위 변수명은 기존 쿼리스트링명과 같음

const $list = document.querySelector('#list');




//https://www.flickr.com/services/rest/?api_key=키값&per_page=10&tagmode=any&privacy_filter=5&format=json&nojsoncallback=1&method=flickr.interestingness.getList; <- 이게 실 주소 
const base_url = `${url}api_key=${key}&per_page=${per_page}&tagmode=${this.tagmode}&privacy_filter=${privacy_filter}&format=${format}&nojsoncallback=${nojsoncallback}`;
const result_url = `${base_url}&method=${interest}`; 
// 뒤는 플리커가 제공하는 메서드가 있기 때문에 검색할떈 바꿔야해서 base_url까지는 같고 그 뒤만 result_url로 나눠놓음





/* -------------  이벤트 정의 ------------ */ 

fetchData(result_url)
.catch(function(err){
	console.error(err);
})
.then(function(result){
	// console.log(result);
	createDOM(result, $list);
});





/* -------------  함수 정의 ------------ */ 
// 데이터를 요청해서 json 객체를 반환하는 함수

function fetchData(url) {
	return fetch(url)	
		.then(function(data){
			// 데이터를 받아서 json객체 형태로 변환해서 다음 then에 넘긴다 (await써도 됨)
			let result = data.json();	
			return result;
		})	
		.then(function(json){
			//해당 josn데이터를 잘 받아오면 resolve 아니면 reject 그걸 then catch로 로 잡는다		
			return new Promise(function(resolve, reject){
				(json) ? resolve(json) : reject();			
			})	
		})
}


// 돔 생성 함수 정의 
function createDOM(data, parentEl) {
	const item = data.photos.photo;
	// console.log(item)
	item.map(function( data, idx ) {
		console.log(data)
		let new_li = document.createElement('li')
		let new_img = document.createElement('img')
		let new_src = document.createAttribute('src')
		let new_div = document.createElement('div')
		let new_a = document.createElement('a')
		let new_p = document.createElement('p')
		let new_href = document.createAttribute('href')
		
		// let a = document.createElement('a')
		// let a_src = document.createAttribute('href')
		// let text = document.createTextNode('big size image!!')
	

		new_src.value = `https://farm${data.farm}.staticflickr.com/${data.server}/${data.id}_${data.secret}_m.jpg`
		new_img.setAttributeNode(new_src)


		new_href.value = `https://farm${data.farm}.staticflickr.com/${data.server}/${data.id}_${data.secret}_b.jpg`
		new_a.setAttributeNode(new_href)
		// a_src.value = `https://farm${data.farm}.staticflickr.com/${data.server}/${data.id}_${data.secret}_b.jpg`
		// a.setAttributeNode(a_src)
		
		new_p.innerText = data.title;
		
		parentEl.appendChild(new_li)
		new_li.appendChild(new_div)
		new_div.appendChild(new_a)
		new_a.appendChild(new_img)
		new_div.appendChild(new_p)
		// new_li.appendChild(a)
		// a.appendChild(text)

		new_li.classList.add('item')

	})
}


// node는 기본적으로 3개 있음 element Node / attribute Node 텍스트노드