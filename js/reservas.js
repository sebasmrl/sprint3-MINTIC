const d = document;

const $form  = d.getElementById("form-reservar")
const $tabla = d.querySelector(".tabla");
console.log($tabla.lastElementChild)


console.log($form);

d.addEventListener("DOMContentLoaded", e => {

	fetch("http://localhost:8080/reserva")
	.then((response) => response.json())
	.then( rs =>{
		console.log(rs)
		$tabla.lastElementChild.appendChild(createRowTable(rs))
	})
})


$form.addEventListener("submit", (e) => {
	e.preventDefault();
	e.stopPropagation();


	const nombre = $form.children.namedItem("nombre");
	const iden = $form.children.namedItem("iden");
	const nPersonas = d.getElementById("numPersonas");
	const telefono = $form.children.namedItem("telefono");
	const t = d.getElementsByName("transporte");
	let transporte;

	t.forEach( (value, index) =>{
		
		if(value.checked && index==0) {
			transporte=true
		}
		if(value.checked && index==1) {
			transporte=false
		}
			
	})

	const data = {
		iden: iden.value, 
		nombre: nombre.value,
		telefono: telefono.value, 
		transporte,
		nPersonas: nPersonas.options[nPersonas.selectedIndex].text
	}

	console.log(data)
	
	fetch('http://localhost:8080/reserva', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        //mode: 'cors', // no-cors, *cors, same-origin
        //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        //credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
        //redirect: 'follow', // manual, *follow, error
        //referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
        })
        .then((response) => response.json())
		.then( (rs) => {
			console.log("respuesta del fetch", rs)
			$tabla.appendChild(createRowTable([rs]));
	})

/* 
	console.log(transporte, telefono.value)
	
	console.log(nombre.value, iden.value, nPersonas.options[nPersonas.selectedIndex].text, ) */
	
})


function createRowTable(data=[]){
	
	$fragment = d.createDocumentFragment();

	data.forEach( (element)=>{
		
	const {id, iden,nombre,telefono,transporte} = element;

	$tr = d.createElement("tr");
	$tr.setAttribute("id", "uid"+id)

	$id = d.createElement("th");
    $id.textContent = id;

	$iden = d.createElement("th");
    $iden.textContent = iden;

	$nombre = d.createElement("th");
    $nombre.textContent = nombre;

	$telefono = d.createElement("th");
    $telefono.textContent = telefono;

	$transporte = d.createElement("th");
    $transporte.textContent = transporte;

	$btn = d.createElement("button");
	$btn.textContent = "Eliminar";
	$btn.setAttribute("id", "btn-delete")
	$btn.setAttribute("value", id)
	
	$tr.appendChild($id)
	$tr.appendChild($iden)
	$tr.appendChild($nombre)
	$tr.appendChild($telefono)
	$tr.appendChild($transporte)
	$tr.appendChild($btn)
	
	$fragment.appendChild($tr)

	});


	return $fragment;

}

$tabla.addEventListener('click', (e) => {
	console.log("click")
	if(e.target.classList.has='btn-delete'){
		console.log(e.target.value)

		fetch(`http://localhost:8080/reserva/eliminar/${e.target.value}`, {
			method: 'DELETE',
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
		})
		.then(response => response.json())
		.then(rs => {
			console.log(rs)
			$th = d.getElementById(`uid${e.target.value}`)
			$tabla.lastElementChild.removeChild($th)

		})

	}
})

