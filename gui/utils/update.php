<?php
include('dblinker.php');
try{
	$obj = json_decode($_POST["x"], false);
	
	$stmt = $conn->prepare("UPDATE signals SET name = :name,lat = :lat,lon = :lon WHERE id = ".$obj->id );
 
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':lat', $lat);
    $stmt->bindParam(':lon', $lon);

    $name = $obj->name;
    $lat = $obj->lat;
    $lon = $obj->lon;
    $stmt->execute();
	
	$stmt = $conn->query("SELECT * FROM signalgroups");
	while($data = $stmt->fetch(PDO::FETCH_ASSOC)){
		$id = explode(",", $data['signals']);
		$name = explode(",", $data['signalnames']);
		for($i=0;$i<sizeof($id);$i++){
			if($id[$i] == $obj->id){
				$name[$i]=$obj->name;
				
			}		
		}
		$data['signalnames']=implode(',',$name);
		$stmt2 = $conn->prepare("UPDATE signalgroups SET signalnames = :signalnames WHERE id = ".$data['id']);
		$stmt2->bindParam(':signalnames', $data['signalnames']);
		$stmt2->execute();
	}
	
	
	echo $obj->id;
	
	
}
catch(PDOException $e)
{
	echo "Error: " . $e->getMessage();
}
$conn = null;
?>