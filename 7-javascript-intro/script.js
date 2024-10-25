document.onreadystatechange = function (event) {
    if (document.readyState === 'complete') {
        console.log('Hello from JavaScript')
        
        const div1 = document.getElementById('div1')
        div1.innerHTML = 'Some text for div1'
        
        const div2 = document.getElementsByClassName('div-class')[1]
        div2.innerHTML = 'Some text for div2'
        
        const divs = document.getElementsByTagName('div')
        divs[0].style = "text-decoration:underline;"
        divs[1].style = "text-decoration:underline;"
    }
}

console.log('Script was loaded')


