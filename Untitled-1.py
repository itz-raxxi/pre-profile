def find_min_max(arr,low,high):
    if low==high:
        return arr[low],arr[low]
    mid=(low+high)//2

    left_min,left_max=find_min_max(arr,low,mid)
    right_min,right_max=find_min_max(arr,mid+1,high)

    return min(left_min,right_min),max(left_max,right_max)
arr=input("enter the element seprated by spaces").split()
arr=(int(x)for x in arr)
min_val,max_val=find_min_max(arr,0,len(arr)-1)
print("maximum value",max_val)
print("minimum value",min_val)
