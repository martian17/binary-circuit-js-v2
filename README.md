# Binary-circuit v2
This is a rework of my previous project [hd.js](https://github.com/martian17/hd.js).  
The previous version had a very verbose API, and I've reworked it to make it functional.  
There is still some needs to make some looped connection, like in the case of a flip flop. 
In those cases, you still need to do it gate by gate.  
  
Evaluation is not the end goal of this library, and thus it is done one bit flip at a time with pointer traversal.  
This format is intended to be compiled into a more efficient array based representation that updates the whole circuit all at once, 
or better yet partially with masks.  
  
My other projects will be referencing this module through npm with paths starting with github.com, and when I see that it is matured enough, I will publish it.
