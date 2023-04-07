import 'package:carousel_slider/carousel_slider.dart';
import 'package:client_photogenie/models/caroussel_model.dart';
import 'package:client_photogenie/screens/photo_screen.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../models/photo_model.dart';
import '../widgets/category_caroussel.dart';

class GalleryPage extends StatelessWidget {
  const GalleryPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: const Color.fromARGB(255, 5, 2, 29),
        body: SafeArea(
          child: Column(
            children: <Widget>[
              CarouselSlider(
                  options: CarouselOptions(
                    reverse: false,
                    initialPage: 0,
                    autoPlay: false,
                    aspectRatio: 1.5,
                    viewportFraction: 0.6,
                    height: 150,
                  ),
                  items: Caroussel.carroussels
                      .map(
                        (caroussel) => CategoryCaroussel(caroussel: caroussel),
                      )
                      .toList()),
              const SizedBox(
                height: 10,
              ),
              Expanded(
                  child: GridView.builder(
                itemCount: photos.length,
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 3,
                    crossAxisSpacing: 4.0,
                    mainAxisSpacing: 4.0),
                itemBuilder: (BuildContext context, int index) {
                  return InkWell(
                    onTap: () {
                      Get.to(
                        () => PhotoScreen(photo: photos[index]),
                      );
                    },
                    child: Image.network(photos[index].imageUrl,
                        fit: BoxFit.cover),
                  );
                },
              )),
            ],
          ),
        ));
  }
}

const List<Photo> photos = <Photo>[
  Photo(
    imageUrl:
        'https://images.unsplash.com/photo-1480796927426-f609979314bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY3NDE1ODAyMw&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
  ),
  Photo(
    imageUrl:
        'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY3Mzk3NzQwNA&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
  ),
  Photo(
    imageUrl:
        'https://images.unsplash.com/photo-1480796927426-f609979314bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY3NDE1ODAyMw&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
  ),
  Photo(
    imageUrl:
        'https://images.unsplash.com/photo-1480796927426-f609979314bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY3NDE1ODAyMw&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
  ),
  Photo(
    imageUrl:
        'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY3Mzk3NzQwNA&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
  ),
  Photo(
    imageUrl:
        'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY3MzkwMTM5MA&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
  ),
  Photo(
    imageUrl:
        'https://images.unsplash.com/photo-1480796927426-f609979314bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY3NDE1ODAyMw&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
  ),
  Photo(
    imageUrl:
        'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY3MzkwMTM5MA&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
  ),
  Photo(
    imageUrl:
        'https://images.unsplash.com/photo-1563460716037-460a3ad24ba9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY3NzAzMjk2OQ&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
  ),
  Photo(
    imageUrl:
        'https://images.unsplash.com/photo-1480796927426-f609979314bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY3NDE1ODAyMw&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
  ),
  Photo(
    imageUrl:
        'https://images.unsplash.com/photo-1585335740623-f7a1f0c446eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY3MzkyMjMwMg&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
  ),
  Photo(
    imageUrl:
        'https://images.unsplash.com/photo-1480796927426-f609979314bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY3NDE1ODAyMw&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
  ),
  Photo(
    imageUrl:
        'https://images.unsplash.com/photo-1563460716037-460a3ad24ba9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY3NzAzMjk2OQ&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
  ),
  Photo(
    imageUrl:
        'https://images.unsplash.com/photo-1480796927426-f609979314bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY3NDE1ODAyMw&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
  ),
];

class SelectCard extends StatelessWidget {
  const SelectCard({required super.key, required this.photo});
  final Photo photo;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 150,
      height: 120,
      child: Card(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(2.0),
        ),
        elevation: 2,
        margin: const EdgeInsets.all(2.0),
        child: Expanded(
          child: Image.network(
            photo.imageUrl,
            fit: BoxFit.cover,
          ),
        ),
      ),
    );
  }
}
