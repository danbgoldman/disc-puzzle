class PersistentRingBuffer {
	constructor(prefix, capacity) {
		this.prefix = prefix;
		this.capacity = capacity;
		
		this.end = 0;
		this.size = 0;
	}

	endItemName() {
		return this.prefix + this.end;
	}
	
	push(value) {
		localStorage.setItem(this.endItemName(), value);

		if (++this.end >= this.capacity) {
			this.end = 0;
		}
		if (this.size < this.capacity) {
			this.size += 1;
		}
	}
	
	pop() {
		if (this.size === 0) {
			return;
		}
		if (--this.end < 0) {
			this.end += this.capacity;
		}
		this.size--;
		
		let name = this.endItemName();
		let result = localStorage.getItem(name);
		localStorage.removeItem(name);
		return result;
	}
};

function _ringBufferTest() {
	localStorage.clear();
	let buf = new PersistentRingBuffer('test',2);
	buf.push(1);
	buf.push(2);
	buf.push(3);
	console.assert(buf.pop() === "3");
	console.assert(buf.pop() === "2");
	console.assert(buf.pop() === undefined);
}