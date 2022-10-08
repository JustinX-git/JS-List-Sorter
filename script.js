let dragging,
    prevAfterElement,
    draggingCloneArr = [];


class DraggingClone {
    constructor(container, afterElement, ev) {
        this.ev = ev;
        this.isDefined = null;
        this.container = container;
        this.draggingClone = undefined;
        this.afterElement = afterElement;
        this.insertBeforeElement = undefined;
        this.afterElementSibling = this.ev.target.nextElementSibling;
        this.DOM__generalDraggingClone = document.querySelector(".dragging-clone");
        this.DOM__filteredDraggingClone = document.querySelector(".dragging-clone:not(.prev-clone)")
    }

    cloneMainFunc() {
        if (!this.DOM__generalDraggingClone) {
            this.cloneCreateHandler();
        } else if (this.afterElement === prevAfterElement) {
            return;
        } else {
            if (this.DOM__filteredDraggingClone === null) {
                DraggingClone.cloneRemoveHandler(draggingCloneArr[0]);
                draggingCloneArr = [];
                return;
            }
            
            if (!draggingCloneArr[0]) {
                this.cloneCreateHandler();
                this.DOM__filteredDraggingClone.classList.add("shrink", "prev-clone");
                draggingCloneArr.push(this.DOM__filteredDraggingClone)
            } else {
                this.cloneCreateHandler();
                DraggingClone.cloneRemoveHandler(draggingCloneArr[0]);
                this.DOM__filteredDraggingClone.classList.add("shrink", "prev-clone");
                draggingCloneArr[0] = this.DOM__filteredDraggingClone;
            }
        }
    }

    cloneCreateHandler() {
        this.draggingClone = dragging.cloneNode(true);
        this.draggingClone.className = "dragging-clone";
        prevAfterElement = this.afterElement;
        this.clonePositionHandler();
    }

   static cloneRemoveHandler(prevDraggingClone) {
        if (prevDraggingClone) {
            prevDraggingClone.remove();
        } else if (document.querySelector(".dragging-clone")) {
            document.querySelectorAll(".dragging-clone").forEach(each =>{
                each.remove()
            });
        }
    }

    clonePositionHandler() {
        try {
            this.isDefined = this.afterElement.classList.contains("item");
        } catch (error) {
            if (dragging === this.container.lastElementChild && dragging.classList.contains("temp")) {
                while (this.afterElement === undefined) {
                    return
                }
                dragging.classList.remove("temp");
            } else {
                this.container.appendChild(this.draggingClone);
            }

        }

        if (this.isDefined && this.ev.target.classList.contains("item") && !(this.ev.target.classList.contains("dragging"))) {
            if (dragging.classList.contains("temp")) {
                while (this.ev.target === dragging.nextElementSibling || this.afterElement === dragging.nextElementSibling) {
                    return;
                }
                dragging.classList.remove("temp");
            } else {
                this.insertBeforeElement = (this.ev.target === this.afterElement) ? this.afterElement : this.afterElementSibling;
                this.container.insertBefore(this.draggingClone, this.insertBeforeElement)
            }
        }

    }
}

document.querySelectorAll(".item").forEach(item =>{
    item.addEventListener("dragstart", () =>{
        dragging = item;
        dragging.classList.add("dragging","temp");
        dragging.style.transition = "all 100ms ease-out";
        dragging.style.height = 0;
    })    

    item.addEventListener("dragend", () =>{
        item.classList.remove("dragging", "temp");
        item.style.height = "50px";
        draggingCloneArr = [];
        DraggingClone.cloneRemoveHandler();
    })  
})


const container = document.querySelector(".container")
    let afterElement;
    container.addEventListener("dragover", (ev)=>{
        ev.preventDefault();
        afterElement =  getAfterElement(container, ev.clientY);
        const draggingClone = new DraggingClone(container,afterElement, ev);
        draggingClone.cloneMainFunc()
        
    });

    container.addEventListener("drop", (ev)=>{
        ev.preventDefault();
        dragging.style.transition = "none";
        dragging.style.height = "50px";
          try {
             container.insertBefore(dragging, afterElement);
          } catch (error) {
            return
          }
          DraggingClone.cloneRemoveHandler()
          draggingCloneArr = [];
         })


function getAfterElement(container, y){
    const draggable =[...container.querySelectorAll(".item:not(.dragging)")].filter((each) => each.classList.contains("dragging-clone") === false);
    return  draggable.reduce((closest, child) =>{
        const box = child.getBoundingClientRect();
         const offset = y - box.top - (box.height/2);
      
        if(offset < 0 && offset > closest.offset){
             return{offset:offset, element:child}
         }else{
            return closest
         } 
        }, {offset:Number.NEGATIVE_INFINITY}).element
}
        