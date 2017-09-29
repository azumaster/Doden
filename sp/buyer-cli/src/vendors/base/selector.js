
export default (selector) =>{
    let element;
    if(/^#[^\s]*$/.test(selector)){
        element = document.querySelector(selector);
    }else{
        element = document.querySelectorAll(selector);
    }
    return element;
};