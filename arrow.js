const $list = document.querySelector('#list');
const $wrap = document.querySelector('#wrap');
const $btn = document.querySelector('.btnSearch')
const $input = document.querySelector('#search')

/* api */
const url = "https://www.flickr.com/services/rest/?"; // fliker api 기본 요청 주소
const key = "";  // api token
const per_page = 10; // 이미지 요청 갯수
const tagmode = "any"; // 검색방법 (any는 한칸 띄고 검색해도 됨)
const privacy_filter = 5; // 보안수준  5가 제일 많이 검색됨
const format = "json"; // 데이터 형식
const nojsoncallback = 1; // 모든 json은 callback이 있어서 딸려나옴. 이걸 사용안하겠다. 1은 true 0은 false
const interest = "flickr.interestingness.getList"; // 사용자의 관심자가 많은 이미지를 가져오겠다
const search = 'flickr.photos.search'; // 검색할 수 있는 플리커 api method

//위 변수명은 기존 쿼리스트링명과 같음




//https://www.flickr.com/services/rest/?api_key=키값&per_page=10&tagmode=any&privacy_filter=5&format=json&nojsoncallback=1&method=flickr.interestingness.getList; <- 이게 실 주소 
const base_url = `${url}api_key=${key}&per_page=${per_page}&tagmode=${this.tagmode}&privacy_filter=${privacy_filter}&format=${format}&nojsoncallback=${nojsoncallback}`;
let result_url = `${base_url}&method=${interest}`; 
// 뒤는 플리커가 제공하는 메서드가 있기 때문에 검색할떈 바꿔야해서 base_url까지는 같고 그 뒤만 result_url로 나눠놓음





/* -------------  이벤트 정의 ------------ */ 

// 브라우저 로딩 시 
fetchData(result_url)
.catch(err => {
	console.error(err);
})
.then(result => {
	console.log(result);
	return createDOM(result, $list);
})
.then(result => {
    isoLayout($list)

    $list.onclick = e => {
        // console.log(e.target.closest('div')) //closest 가까운 애만 찍어줌
        let currentP = e.target.closest('div').querySelector('p')
        // console.log(currentP)
    }
})




// 검색버튼 클릭 시 
$btn.onclick = e => {
    let tag = $input.value;
    if(tag === '') return alert('검색어를 입력해용');
    result_url = `${base_url}&method=${search}&tags=${tag}` // tag는 검색어 api query string search로 변경

    fetchData(result_url)
        .catch(err => {
            console.error(err);
        })
        .then(result => {
            // console.log(result);
            return createDOM(result, $list);
        })
        .then(result => {
            isoLayout($list)
        })
}






/* -------------  함수 정의 ------------ */ 
// 데이터를 요청해서 json 객체를 반환하는 함수

function fetchData (url) {
	return fetch(url)	
		.then(data => {
			// 데이터를 받아서 json객체 형태로 변환해서 다음 then에 넘긴다 (await써도 됨)
			let result = data.json();	
			return result;
		})	
		.then(json => {
			//해당 josn데이터를 잘 받아오면 resolve 아니면 reject 그걸 then catch로 로 잡는다		
			return new Promise((resolve, reject) => {
				(json) ? resolve(json) : reject();			
			})	
		})
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}


// 돔 생성 함수 정의 
async function createDOM (data, parentEl) {
	const item = data.photos.photo;
    // console.log(item)
    
    // 리스트를 받아올떄마다 새로 그려줌 + 온도 삭제
    parentEl.innerHTML = '';
    $wrap.classList.remove('on')
    $wrap.style.transitionDuration = '0s'


	item.map(( data, idx ) => {
		console.log(data)
		let new_li = document.createElement('li')
		let new_img = document.createElement('img')
		let new_src = document.createAttribute('src')
		let new_div = document.createElement('div')
		let new_a = document.createElement('a')
		let new_p = document.createElement('p')
        let new_href = document.createAttribute('href')
        
        let new_onerror = document.createAttribute('onerror')
		
		// let a = document.createElement('a')
		// let a_src = document.createAttribute('href')
		// let text = document.createTextNode('big size image!!')
    
        
        // 예외처리 이미지 없을 때
        // new_onerror.value = "javascript:this.src='./k1.jpg'" //방법 1
        new_onerror.value = "javascript:this.parentNode.parentNode.parentNode.style.display='none'" //방법2
        new_img.setAttributeNode(new_onerror)

        


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

    // 데이터를 다 받아오면 온을 붙임
    $wrap.classList.add('on')
    $wrap.style.transitionDuration = '1s'
    

    await delay(1000) // dom이 생성되고 이미지가 생성되는 시간을 1초정도 범 async await 로 동기화

    // dom생성완료후 프로미스 리턴해서 
    // 이후 then 메서드로 isoLayout 적용
    // return new Promise((resolve, reject) => {
    //     console.log('hoho')
    //     resolve('hehe')
    // })

    console.log('hoho')
}


// node는 기본적으로 3개 있음 element Node / attribute Node 텍스트노드





function isoLayout(ele) {
    // 첫번쨰는 부모
    new Isotope(ele, {
        itemSelctore: '.item',
        columWidth: '.item',
        transitionDuration: '0.5s',
        percentPosition: true, //위드 퍼센트로할건지 픽셀로 할건지 트루가 퍼센트
    });
}