import { createSignal, createResource } from "solid-js";
import dayjs from "dayjs"; 

const NewRentModal = (props) => {
    const [name, setName] = createSignal("");
    const [category, setCategory] = createSignal("");
    const [person, setPerson] = createSignal({prename: "", surname: ""});
    const [item, setItem] = createSignal("");
    const [startDate, setStartDate] = createSignal("");
    const [endDate, setEndDate] = createSignal("");
    const [message, setMessage] = createSignal("");
    const [isAvailable, setIsAvailable] = createSignal(true);
    const [isOpen, setIsOpen] = createSignal(false);

    let baseUrlRent = 'http://localhost:3000/api/rentdb';
    let baseUrlPerson = 'http://localhost:3000/api/persondb';
    let baseUrlItem = 'http://localhost:3000/api/itemdb';
    const [user, setUser] = createSignal(null);

    let categories = ["cameras", "camera lenses", "Tripods", "light"];

    const fetchItemRessource = async() => {
        let userFromLocalStorage = JSON.parse(localStorage.getItem("user")); 
        let token =  localStorage.getItem("token"); 
        let data = await fetch(baseUrlItem, {method: 'GET', authorization: "Bearer " + token});
        let json = await data.json(); 
        return json.items;
    }
    const [items, { refetch: refetchItem }] = createResource(fetchItemRessource); 

    const saveRent = async() => {
        let userFromLocalStorage = JSON.parse(localStorage.getItem("user")); 
        let token =  localStorage.getItem("token"); 
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', "authorization": "Bearer " + token },
            body: JSON.stringify({ itemId: item().id, personId: userFromLocalStorage.id, startDate: dayjs(startDate()).hour(0).minute(0).unix(), endDate: dayjs(endDate()).hour(23).minute(59).unix(), message: message()})
        };
        let data = await fetch(baseUrlRent, requestOptions);
        if (data.status === 200) {
            let json = await data.json(); 
            console.log(json);
            props.refetchFunction();
        } else {
            alert("Fehler: " + data.statusText);
        }
        setIsOpen(false);
    }

    return (
        <div>
            <button class="btn my-5" onClick={() => setIsOpen(true)}>Add Rent</button>
            <div class={isOpen() ? "modal modal-open" : "modal"}> 
                <div class="modal-box">
                <h3 class="font-bold text-lg">Add new rent</h3>
                <p class="py-4">Choose Start and End Date. You might add a message. Choose person and item.</p>
                <form method="dialog mt-40">
                    <label class="input input-bordered flex items-center gap-2">
                        <input type="date" class="grow" placeholder="Start Date..." value={ name() } onInput = {  (e) => setStartDate(e.target.value)  }/>
                    </label>
                    <label class="input input-bordered flex items-center gap-2 my-5">
                        <input type="date" class="grow" placeholder="End Date..." value={ name() } onInput = {  (e) => setEndDate(e.target.value)  }/>
                    </label>
                    <label class="input input-bordered flex items-center gap-2">
                        <input type="text" class="grow" placeholder="Message..." value={ message() } onInput = {  (e) => setMessage(e.target.value)  }/>
                    </label> 
                    <div class="dropdown dropdown-top">
                        <div tabindex="0" role="button" class="btn m-1">{item() === "" ? "Choose item" : item().name + " | " + item().category}</div>
                        <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                            { items() && items().map((item => <li onClick={() => setItem(item)}><a>{item.name + " | " + item.category}</a></li>)) }
                        </ul>
                    </div>                                 
                </form>
                <div class="modal-action">
                    <button class="btn" onClick={() => setIsOpen(false)}>Close</button>
                    <button class={ person() && item() ? "btn btn-success": "btn btn-disabled" } onClick={() => saveRent()}>Save</button> 
                </div>  
            </div>
            </div> 
        </div>
    )
};

export default NewRentModal;

