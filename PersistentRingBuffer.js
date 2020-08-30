class PersistentRingBuffer {
	constructor(prefix, capacity) {
		this.prefix = prefix;
		this.capacity = capacity;
		
		this.end = 0;
		this.size = 0;
		
		this.loadMetadata();
	}

	endItemName() {
		return this.prefix + this.end;
	}
	
	loadMetadata() {
		let end = localStorage.getItem(this.prefix + "end");
		let size = localStorage.getItem(this.prefix + "size");
		if (end === null || size === null) {
			return;
		}
		end = parseInt(end);
		size = parseInt(size);
		
		if (size > this.capacity) {
			throw "PersistentRingBuffer: size " + size + "> capacity " + this.capacity;
		}
		
		this.end = end;
		this.size = size;
	}
	
	saveMetadata() {
		localStorage.setItem(this.prefix + "end", this.end);
		localStorage.setItem(this.prefix + "size", this.size);
	}
	
	push(value) {
		localStorage.setItem(this.endItemName(), JSON.stringify(value));

		if (++this.end >= this.capacity) {
			this.end = 0;
		}
		if (this.size < this.capacity) {
			this.size += 1;
		}
		this.saveMetadata();
	}
	
	pop() {
		if (this.size === 0) {
			return;
		}
		if (--this.end < 0) {
			this.end += this.capacity;
		}
		this.size--;
		this.saveMetadata();
		
		let name = this.endItemName();
		let result = localStorage.getItem(name);
		localStorage.removeItem(name);
		return JSON.parse(result);
	}
};

function _ringBufferTest() {
	localStorage.clear();
	let buf = new PersistentRingBuffer('test', 2);
	buf.push(1);
	buf.push(2);
	buf.push(3);
	console.assert(buf.pop() === 3);
	console.assert(buf.pop() === 2);
	console.assert(buf.pop() === undefined);
	buf.push("persistent");
}