# Advent of Code 2018

## High Level Thoughts

Last year I tried using Typescript and I wasn't very good at it. A lot of the code wouldn't properly typecheck and I wasn't experienced enough to know how to resolve it. This year was much better on that front! I felt like Typescript didn't really "get in my way" so much, which is nice since it means I'm either understanding it better or the language has improved in common javascript idioms.

After last year I told myself I'd just execute all my code through the test runner, as it was irritating having to go through the `tsc -> execute` pipeline and the test running should handle that for me. I think that ended up being a mistake overall; jest doesn't print to the console until the test finishes executing. This causes a bit of complexity in cases where I was trying to debug potential infinite loops (I realize now writing it I probably should have just put a timeout on the tests).

I once again attempted a more functional style only to rapidly give that up. The problem sets seem to lend themselves nicely to mutative/stateful implementations, and since this is for fun during a relatively busy holiday season I'd rather go with the flow than against it.

Next year, if I participate again, I will probably use Python instead of Typescript/Javascript. It's a dominant choice and given the batteries included nature of the language I can see why. I also haven't really used Python 3 at all, so it might be nice to get some experience there.

## Day by Day

### Day 1
Part 1 was summing a list, which was pretty straightforward. Looking at my solution now it appears I forgot the `lodash` includes a sum function, which I should have just used. On the plus side, I did remember that `map` calls the function with 3 parameters, which means you really can't just `map(parseInt)` without getting weird results based off it using the index as the base.

Part 2 I got to use generators! Yay! I hadn't really done that much since last year so that was cool. Unfortunately `lodash` doesn't really have nice handling of infinite streams so I just iterated.

### Day 2
Part 1 was against straightforward, just did a count of characters by line then counted how many had 2/3 characters.

Part 2 I played with generators again to generate all unique pairs. Looking at my solution now, I think I got needlessly complex with creating the actual matching substring. I should probably have just done a `countBy`.

### Day 3
Part 1 I just bruteforced all the points. Maybe I should have done the largest bounding box instead and traversed each point once checking if it was within the regions? In either case this was fine.

Part 2 I again just bruteforced.

### Day 4
I think most of my work here was on parsing. Again it's mostly just bruteforcing all the sleep windows. I also thought it was really funny to say sleepy and sleepiest. Maybe I was sleepy.

### Day 5
I really liked this problem. My initial solution to part 1 was REALLY bad and slow, and part 2 gave me the push I needed to actually do the fast more obvious solution. You can really see me here trying to make reduce do work instead of just putting in a loop.

### Day 6
This problem was neat. Looking at my solution now I'm not necessarily wild about it, but the general insight of "if you hit an edge you are infinitely expanding beyond it too" was nice. If I remember correctly I had an irritating bug with `range` here because I kept getting it mixed up whether it was inclusive or not.

There are a _lot_ of grid problems across this year and last year. I should probably just invest in making a grid abstraction so I don't have to keep remembering x/y inversion in some places and not others.

### Day 7
This would have been much nicer if I had a priority queue data structure. Other than that it's relatively straightforward producer/consumer simulation except without threads.

### Day 8
Tree parsing and traversal. Again probably easier to understand if I just...wrote a tree traversal function instead of messing around with lodash chains.

### Day 9
Circular list maintenance. Straightforward.

### Day 10
This was kind of a neat problem. Made the assumption that when the bounding box is the smallest the message would be most legible. This isn't true in the general case of the problem (for example one that includes stars not part of the message just accelerating away), but it worked well enough here and didn't require more complicated clustering checks.


### Day 11
This was really cool! I originally did a really inefficient solution that kind of worked, but after doing more investigation learned about summed area squares. A+ fun and educational. Part 2 was just trying all the possibilities but since I made part 1 more efficient this wasn't super expensive.

### Day 12
Part 1 I just bruteforced. Since the edges are all empty pots I just kept track of the index of the left-most for adding to the result.

Part 2 was a sufficiently large number of generations that I assumed there had to be a repeating pattern. I just logged it and computed the results by hand after inspecting, though one of the later problems I handle the loop algorithmically so I don't feel too bad about cheating here.

### Day 13
I tried to get too clever here and took a long time trying to build an abstraction. I really shouldn't have. I eventually just used the a 2d array and repeated iteration to move around. Fortunately learning this lesson helped out a bunch in later puzzles where it turns out yes, just go over the entire grid basically every time.

### Day 14
Part 1 was very straightforward. Part 2 was pretty straightforward too, just keeping the current slice to see. I remember reading about a smarter text find they use in grep but the problem ran fast enough that I didn't care to get clever.

### Day 15
This problem was conceptually easy and implementation wise very fiddly. This is probably the solution I'm least proud of; I ended up hacking around a few mis-understandings (specifically re: pathing priority). The code is really ugly and this problem doesn't really necessarily warrant that. To be honest given the length of the problem statement I put it off until almost the end and finished it like an hour before day 25 was released so I'm just glad it's done.

I thought Part2 might be better with a binary search style approach to find the target attack value, but the simulation was fast enough and the answer was low enough that I just looped it forward instead. I did use the binary search style in a later problem at least.

### Day 16
I love this problem. I really like writing machine emulators. I really liked solving the opcodes in part 2. The only bummer was that the input kind of sucked to parse and that part 2 could be done pretty easily by hand. 

### Day 17
This was another cool problem. I liked implementing the flood fill. I feel like there's probably a more efficient solution than mine but the kind of straightforward "everytime you fall add it to a stack to evaluate later just in case you overflow from below" worked ok. Part 2 was really straightforward if you did part 1 the way I did and actually updated the visual grid. I think this year taught me the importance of making sure I could visualize the processing steps the same way the problem shows them for debugging/investigation.

### Day 18
game of life! Part 2 was similar to Day 12 where I assumed there was a looping pattern. In this case I actually solved the repeat result algorithmically though, which was nice.

### Day 19
More playing with an imaginary machine, expanded from Day 16. Part 1 was implementation which was cool and I liked. Part 2 was not really my favorite, I don't really _love_ staring at assembly instructions to try to figure out what they are doing. Regardless, after staring at it a bit and inspecting various registers during execution the intent of the algorithm was clear enough that I could just do the one-liner seen in the solution for it. A neat problem; I should probably get better at assembly patterns so I don't have myself if I do this next year.

### Day 20
Didn't care super much for this problem. The input followed patterns that aren't guaranteed by the problem statement but makes it much easier. Solution itself is pretty straightforward when you make those assumptions though, and part 2 follows easily from the work in part 1.

### Day 21
More assembly! Yay! I did a better job at figuring out the actual program this time and how to get the results from it. In this case it was really just special casing one instruction to record what one of the vals its called with is. Not bad once I saw that the register was only used in one place and immediately jumped out if equal.

### Day 22
I like this problem. A* was fun to implement and generating the grid first was a nice touch. At first read I expected there to be a gotcha around knowing modulo multiplication results, but the problem as stated took care of that for us. 

### Day 23
Part 1 was straightforward even though I originally misread it as "how many bots are in range of the bot with the most bots in range" instead of "how many bots are in range of the bot with the largest radius". Solution is a little uglier than I'd have liked as a result of just doing the minimal modification for the change.

Part 2 was WTF and I have no idea how I was expected to solve it. I did a bit of research on intersection spheres and :shrug:. Originally I thought "ok maybe I can bruteforce" so I tried doing some quick calculations are points inside a bounding box and it was TOO MANY. Eventually I looked at reddit to see what I was missing and saw a bunch of people saying basically the same thing or posting solutions that worked on their input but not others. Learned a bit about Z3 which was nice but seriously WTF I want to know what the expected solution here was.

### Day 24
Combat simulation where the combat rules make sense! I had fun with this one and found it pretty straightforward. I think my obsession with lodash definitely complicates the solution though.

### Day 25
Union-Find! I recognized the problem setup immediately and still had a dumb time implementing it correctly for a while. Once I actually did it right it was straightforward.