class LinkedList {
	constructor() {
		this.head = null;
		this.tail = null;
		this.length = 0;
	}

	// Add an element at the end of the list.
	add(value) {
		var new_node = new Node(value);

		// If the Linked List is empty
		if (this.head == null) {
			this.head = new_node;
			this.tail = new_node;
		}
		else {
			this.tail.link(new_node);
			this.tail = new_node;
		}
		this.length++;
	}

	// Add an element at the start of the list
	push(value) {
		var new_node = new Node(value);
		new_node.link(this.head);

		this.head = new_node;

		if (this.tail == null) {
			this.tail = new_node;
		}
		
		this.length++;
	}

	remove_first() {
		var node = this.head;
		this.head = node.next;
		this.length--;

		return node;
	}
}

class Node {
	constructor(value) {
		this.value = value;
		this.next = null;
	}

	link(node) {
		this.next = node;
	}

}
