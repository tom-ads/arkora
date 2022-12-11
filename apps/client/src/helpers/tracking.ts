/* 
    A helper function that receives a time string and returns
    the duration minutes. ie. 05:50 = 350 minutes
*/
export function timeToMinutes(time: string) {
  const splitTime = time.split(':')
  const hourToMinutes = parseInt(splitTime[0], 10) * 60

  return hourToMinutes + parseInt(splitTime[1], 10)
}
